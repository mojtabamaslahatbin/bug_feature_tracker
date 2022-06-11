import React, { useEffect, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { useDispatch, useSelector } from "react-redux";
// components
import Home from "./components/Home/Home";
import SideDrawer from "./components/SideDrawer/SideDrawer";
import FlashMessage from "./components/FlashMessage/FlashMessage";
import Loading from "./components/Loading/Loading";
import AddItem from "./components/items/AddItem/AddItem";
import ReportedBugs from "./components/ReportedBugs/ReportedBugs";
import TechRequests from "./components/TechRequests/TechRequests";
import ItemDetails from "./components/ItemDetails/ItemDetails";
import EditItem from "./components/items/EditItem/EditItem";
import ResetPassword from "./components/Auth/ResetPassword";
import MagicLink from "./components/Auth/MagicLink";
//types and interfaces
import { ItemInterface, PersonInterface } from "./Types/types";
import { supabase } from "./database/Database";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import AssignedToMe from "./components/MyItems/AssignedToMe";
import { InitialStateType } from "./store/reducers/items";
import * as actionTypes from "./store/actions/actionTypes";

const Reports = React.lazy(() => import("./components/Reports/Reports"));
const MyItems = React.lazy(() => import("./components/MyItems/MyItems"));
const Login = React.lazy(() => import("./components/Auth/Login"));

function App() {
    const state = useSelector((state: InitialStateType) => state);
    const dispatch = useDispatch();
    const dispatchFlashMessage = (message: string, type: "success" | "error") =>
        dispatch(actionTypes.showFlashMessage(message, type));
    const dispatchStartFetching = () => dispatch(actionTypes.startFetching());
    const dispatchEndFetching = () => dispatch(actionTypes.endFetching());
    const dispatchFetchUserSucceed = (userData: PersonInterface) =>
        dispatch(actionTypes.fetchUserSucceed(userData));
    const dispatchFetchItemsSucceed = (itemsData: ItemInterface[]) =>
        dispatch(actionTypes.fetchItemsSucceed(itemsData));

    useEffect(() => {
        if (!state.loggedIn) {
            supabase.auth.signOut();
        } else {
            dispatchStartFetching();
            const appUserId = supabase.auth.user()?.id;
            if (appUserId) {
                const findAppUser = async () => {
                    try {
                        const { data, error } = await supabase
                            .from("users")
                            .select("*")
                            .eq("user_id", appUserId)
                            .single();
                        if (error) {
                            dispatchFlashMessage(`${error.message}`, "error");
                        } else {
                            dispatchFetchUserSucceed(data);
                        }
                    } catch (e) {
                        dispatchFlashMessage("An Error Occurred In Finding Your Identity", "error");
                    } finally {
                        dispatchEndFetching();
                    }
                };
                findAppUser();
            } else {
                dispatchFlashMessage("error in finding user id", "error");
                dispatchEndFetching();
            }
        }
    }, [state.loggedIn]);

    useEffect(() => {
        dispatchStartFetching();
        const ac = new AbortController();

        async function fetchItems() {
            try {
                const { data, error } = await supabase
                    .from("items")
                    .select("*")
                    .abortSignal(ac.signal)
                    .order("dateAdded", { ascending: false });
                if (error) {
                    dispatchFlashMessage(`${error.message}`, "error");
                } else {
                    //TODO:[bug] sort of items in table changes after editing items
                    const loadedItems: ItemInterface[] = [];
                    for (const key in data) {
                        loadedItems.push({
                            ...data[key],
                            dateAdded: parseInt(data[key].dateAdded),
                            assignedTo: JSON.parse(data[key].assignedTo),
                            addedBy: JSON.parse(data[key].addedBy),
                            dateDone: data[key].dateDone ? parseInt(data[key].dateDone) : null,
                        });
                    }
                    dispatchFetchItemsSucceed(loadedItems);
                    console.log(loadedItems);
                }
            } catch (e) {
                dispatchFlashMessage("An Error Occurred In Loading Items", "error");
            } finally {
                dispatchEndFetching();
            }
        }

        fetchItems();
        return () => {
            ac.abort();
        };
    }, [state.fetchCount]);

    function Redirect(props: { to: string }) {
        let navigate = useNavigate();
        useEffect(() => {
            navigate(props.to);
        });
        return null;
    }

    const LoginContainer = () => (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/magic-link" element={<MagicLink />} />
            <Route path="*" element={<Redirect to="/login" />} />
        </Routes>
    );

    return (
        <React.Fragment>
            <CssBaseline />
            <Suspense fallback={<Loading />}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    {state.loggedIn ? (
                        <>
                            <SideDrawer />
                            <div
                                style={{
                                    marginTop: "90px",
                                    width: "90%",
                                    flexGrow: 1,
                                    padding: "0 2rem",
                                }}
                            >
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/add-item" element={<AddItem />} />
                                    <Route path="/bugs" element={<ReportedBugs />} />
                                    <Route path="/requests" element={<TechRequests />} />
                                    <Route path="/my-items" element={<MyItems />} />
                                    <Route path="/assigned-to-me" element={<AssignedToMe />} />
                                    <Route path="/reports" element={<Reports />} />
                                    <Route path="/item/:id" element={<ItemDetails />} />
                                    <Route path="/item/:id/edit" element={<EditItem />} />
                                    <Route path="/change-password" element={<ResetPassword />} />
                                    <Route path="/admin-panel" element={<AdminPanel />} />
                                    <Route path="*" element={<Redirect to="/" />} />
                                </Routes>
                            </div>
                        </>
                    ) : (
                        <LoginContainer />
                    )}
                </div>
                <FlashMessage
                    message={state.messageText}
                    snackBarOpen={state.showMessage}
                    messageType={state.messageType}
                />
            </Suspense>
        </React.Fragment>
    );
}

export default App;
