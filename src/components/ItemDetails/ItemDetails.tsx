import React, {useCallback, useLayoutEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux'

import {
    StepLabel,
    Stepper,
    Divider,
    Avatar,
    Stack,
    Step,
    Grid,
    Chip,
    Box,
    Fab
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {ItemInterface} from "../../Types/types";
import ImageAlbum from "../ImageAlbum/ImageAlbum";
import Loading from "../Loading/Loading";
import doneImage from "../../assets/Images/done.png";
import {supabase} from "../../database/Database";
import {InitialStateType} from "../../store/reducers/items";
import * as actionTypes from "../../store/actions/actionTypes";

const steps = ["New", "Viewed by PM", "Submitted by PM", "In Progress", "Done"];
//TODO:refactor this hardcoded part and add to db

const ItemDetails = () => {
    const {id} = useParams();
    const [item, setItem] = useState<ItemInterface | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const state = useSelector((state: InitialStateType) => state)
    const dispatch = useDispatch()
    const dispatchFlashMessage = useCallback((message: string, type: "success" | "error") => dispatch(actionTypes.showFlashMessage(message, type)), [dispatch])
    const dispatchRemoveItem = () => dispatch(actionTypes.removeItemSucceed())
    const navigate = useNavigate();

    // using "useLayoutEffect" instead of "useEffect" prevents components initial rendering before fetch data
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
        const selectedItem = state.items.filter(item => item.id === id)

        if (selectedItem) setItem(selectedItem?.[0])
    }, [id, state.items])

    const findActiveStep = (status: string | undefined) => {
        switch (status) {
            case "New":
                return 1;
            case "Viewed by PM":
                return 2;
            case "Submitted by PM":
                return 3;
            case "In Progress":
                return 4;
            case "Done":
                return 5;
            default:
                break;
        }
    };

    const EditItemHandler = () => {
        navigate(`/item/${id}/edit`);
    };

    const deleteItemHandler = async () => {
        const deleteConfirm = window.confirm("Are you sure to delete this item ?");
        if (deleteConfirm) {
            setIsLoading(true);
            try {
                const {error} = await supabase.from("items").delete().eq("id", id);
                if (error) {
                    dispatchFlashMessage(`${error.message}`, "error")
                } else {
                    dispatchRemoveItem()
                    dispatchFlashMessage("Item Deleted Successfully", "success")
                    navigate(-1);
                }
            } catch (e) {
                dispatchFlashMessage("Deleting Item Failed", "error")
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Grid container direction="column" sx={{position: "relative"}}>
            {isLoading || state.isLoading ? (
                <Loading/>
            ) : (
                <>
                    <Grid item sm={12}>
                        <Box sx={{width: "100%"}}>
                            <Stepper activeStep={findActiveStep(item?.status)} alternativeLabel>
                                {steps.map(label => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            {/*could be replace with material ui timeline https://mui.com/material-ui/react-timeline/ */}
                        </Box>
                    </Grid>
                    <Divider/>
                    <Grid item sm={12} mt={2}>
                        <Grid container direction="row" spacing={1} sx={{minHeight: "70vh"}}>
                            <Grid item sm={12} md={8}>
                                <Grid container direction="column">
                                    {(item?.addedBy?.user_id === state.appUser?.user_id ||
                                        state.appUser?.access === "superUser") && (
                                        <Grid
                                            item
                                            md={12}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row-reverse",
                                                position: 'relative'
                                            }}
                                        >
                                            <div style={{
                                                position: 'absolute',
                                                display: "flex",
                                                flexDirection: "column",
                                            }}>
                                                <Fab size='small' color="success">
                                                    <EditIcon onClick={EditItemHandler}/>
                                                </Fab>
                                                <Fab size='small' color="error" sx={{mt: 1}}>
                                                    <DeleteIcon onClick={deleteItemHandler}/>
                                                </Fab>
                                            </div>
                                        </Grid>
                                    )}
                                    <Grid
                                        item
                                        md={12}
                                        mb={1}
                                        p={2}
                                        sx={{
                                            boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
                                            borderRadius: "10px",
                                        }}
                                    >
                                        <Grid container spacing={1}>
                                            {[
                                                {
                                                    itemKey: "ID",
                                                    value: item?.id.toString().substring(0, 8),
                                                },
                                                {itemKey: "Type", value: item?.type},
                                                {itemKey: "Status", value: item?.status},
                                                {itemKey: "Priority", value: item?.priority},
                                                {itemKey: "Product", value: item?.product},
                                                {itemKey: "Platform", value: item?.platform},
                                                {
                                                    itemKey: "PlatformVersion",
                                                    value: item?.platformVersion,
                                                },
                                                {
                                                    itemKey: "Added By",
                                                    value: item?.addedBy?.name,
                                                },
                                                {
                                                    itemKey: "Added On",
                                                    value: `${
                                                        item?.dateAdded &&
                                                        new Date(
                                                            item?.dateAdded
                                                        ).toLocaleDateString()
                                                    } - ${
                                                        item?.dateAdded &&
                                                        new Date(
                                                            item?.dateAdded
                                                        ).toLocaleTimeString()
                                                    }`,
                                                },
                                                {
                                                    itemKey: "Done On",
                                                    value:
                                                        item?.dateDone &&
                                                        new Date(
                                                            item?.dateDone
                                                        ).toLocaleDateString(),
                                                },
                                            ].map((item, index) => {
                                                return (
                                                    <Grid key={index} item xs={12} sm={6} md={4}>
                                                        <div
                                                            style={{
                                                                textAlign: "start",
                                                            }}
                                                        >
                                                            <strong>{item.itemKey} : </strong>
                                                            {item.value}
                                                        </div>
                                                    </Grid>
                                                );
                                            })}
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        md={12}
                                        mt={1}
                                        mb={1}
                                        p={2}
                                        sx={{
                                            boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
                                            borderRadius: "10px",
                                        }}
                                    >
                                        <strong>Assigned To : </strong>
                                        {item?.assignedTo?.map((person, idx) => {
                                            return (
                                                <Chip
                                                    avatar={<Avatar alt={person.name}/>}
                                                    label={person.name}
                                                    variant="outlined"
                                                    size="small"
                                                    key={idx}
                                                    sx={{marginLeft: "8px"}}
                                                />
                                            );
                                        })}
                                    </Grid>
                                    <Grid
                                        item
                                        md={12}
                                        mt={2}
                                        p={2}
                                        sx={{
                                            boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
                                            borderRadius: "10px",
                                        }}
                                    >
                                        <Stack spacing={2}>
                                            {[
                                                {itemKey: "Title", value: item?.title},
                                                {
                                                    itemKey: "Description",
                                                    value: item?.description,
                                                },
                                            ].map((item, index) => {
                                                return (
                                                    <div key={index} style={{textAlign: "start"}}>
                                                        <strong>{item.itemKey} :</strong>
                                                        <br/>
                                                        {item.value}
                                                    </div>
                                                );
                                            })}
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sm={12} md={4} sx={{minHeight: "100%"}}>
                                <Box
                                    sx={{
                                        boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
                                        p: 2,
                                        height: "100%",
                                        borderRadius: "10px",
                                    }}
                                >
                                    {item?.images && <ImageAlbum images={item?.images}/>}
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    {item?.status === "Done" && (
                        <div>
                            <img
                                src={doneImage}
                                alt="done-img"
                                style={{
                                    width: "600px",
                                    position: "absolute",
                                    top: "20%",
                                    left: "25%",
                                    opacity: "70%",
                                }}
                            />
                        </div>
                    )}
                </>
            )}
        </Grid>
        //TODO: add actions log at bottom of item details
    );
};

export default ItemDetails;
