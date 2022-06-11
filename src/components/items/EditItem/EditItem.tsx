import React, { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    CircularProgress,
    Autocomplete,
    InputLabel,
    TextField,
    FormHelperText,
    FormControl,
    Typography,
    MenuItem,
    Divider,
    Button,
    Avatar,
    Select,
    Grid,
    Chip,
} from "@mui/material";
import { useFormik } from "formik";
import ImageUpload from "../AddItem/ImageUpload";
import { supabase } from "../../../database/Database";
import { validationSchema } from "../AddItem/AddItem";
import { EditFormInitialValues, PersonInterface } from "../../../Types/types";
import { InitialStateType } from "../../../store/reducers/items";
import * as actionTypes from "../../../store/actions/actionTypes";

const EditItem: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [images, setImages] = useState<string>("[]");
    const [assignedTo, setAssignedTo] = useState<PersonInterface[] | []>([]);
    const [members, setMembers] = useState<PersonInterface[] | null>(null);
    const [formInitialValues, setFormInitialValues] = useState<EditFormInitialValues>({
        type: "",
        title: "",
        description: "",
        status: "",
        priority: "",
        product: "",
        platform: "",
        platformVersion: "",
        dateAdded: null,
        dateDone: null,
        id: "",
        addedBy: undefined,
    });

    const state = useSelector((state: InitialStateType) => state);
    const dispatch = useDispatch();
    const dispatchFlashMessage = (message: string, type: "success" | "error") =>
        dispatch(actionTypes.showFlashMessage(message, type));
    const dispatchUpdateItemSucceed = () => dispatch(actionTypes.updateItemSucceed());

    const { id } = useParams();
    const navigate = useNavigate();

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
        setIsLoading(true);
        const fetchUsers = async () => {
            try {
                const { data, error } = await supabase
                    .from("users")
                    .select()
                    .order("name", { ascending: true });
                if (error) {
                    dispatchFlashMessage(`${error.message}`, "error");
                } else {
                    setMembers(data);
                }
            } catch (e) {
                dispatchFlashMessage("Fetching Users Failed", "error");
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [state.appUser]);

    useEffect(() => {
        window.scrollTo(0, 0);
        setIsLoading(true);

        async function fetchItem() {
            try {
                const { data, error } = await supabase.from("items").select().eq("id", id).single();
                if (error) {
                    dispatchFlashMessage(`${error.message}`, "error");
                } else {
                    const receivedData = {
                        ...data,
                        dateAdded: parseInt(data.dateAdded),
                    };
                    setAssignedTo(data.assignedTo);
                    setImages(data.images);
                    setFormInitialValues(receivedData);
                }
            } catch (e) {
                dispatchFlashMessage("An Error Occurred In Reading Item", "error");
            } finally {
                setIsLoading(false);
            }
        }

        fetchItem();
    }, [id]);

    const formik = useFormik({
        initialValues: formInitialValues,
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: async values => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from("items")
                    .update({ ...values, assignedTo, images })
                    .eq("id", id);
                if (error) {
                    dispatchFlashMessage(`${error.message}`, "error");
                    setIsLoading(false);
                } else {
                    setIsLoading(false);
                    formik.resetForm();
                    dispatchFlashMessage("Item Edited Successfully", "success");
                    dispatchUpdateItemSucceed();
                    localStorage.removeItem("bug-tracker-image");
                    navigate(`/item/${data[0].id}`);
                }
            } catch (e) {
                setIsLoading(false);
                dispatchFlashMessage("Editing Item Failed", "error");
            }
        },
    });

    const fieldChangeHandler = (e: any) => {
        if (e.target.name === "status") {
            if (e.target.value === "Done") {
                setFormInitialValues({
                    ...formInitialValues,
                    [e.target.name]: e.target.value,
                    dateDone: Date.now(),
                });
            } else {
                setFormInitialValues({
                    ...formInitialValues,
                    [e.target.name]: e.target.value,
                    dateDone: null,
                });
            }
        } else {
            setFormInitialValues({
                ...formInitialValues,
                [e.target.name]: e.target.value,
            });
        }
    };

    return (
        <>
            <Grid container direction="row">
                <Grid item md={12}>
                    <Typography variant="h5" component="div" align="left" mb={1}>
                        Add Bug Or Feature Request
                    </Typography>
                    <Divider />
                </Grid>
                <Grid item md={8} mt={2}>
                    <form
                        onSubmit={formik.handleSubmit}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <TextField
                            id="title"
                            name="title"
                            label="Title"
                            size="small"
                            value={formik.initialValues.title}
                            onChange={fieldChangeHandler}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                            style={{ marginBottom: "10px", width: "90%" }}
                            autoFocus
                        />
                        <TextField
                            id="description"
                            name="description"
                            label="description"
                            size="small"
                            multiline
                            rows={4}
                            value={formik.initialValues.description}
                            onChange={fieldChangeHandler}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                            style={{ marginBottom: "10px", width: "90%" }}
                        />

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "90%",
                                flexWrap: "wrap",
                                alignItems: "stretch",
                            }}
                        >
                            <FormControl
                                size="small"
                                style={{ width: "22%" }}
                                error={formik.touched.type && Boolean(formik.errors.type)}
                            >
                                <InputLabel id="type">Type</InputLabel>
                                <Select
                                    labelId="type"
                                    name="type"
                                    id="type"
                                    value={formik.initialValues.type}
                                    label="Type"
                                    onChange={fieldChangeHandler}
                                >
                                    <MenuItem value="bug">Bug</MenuItem>
                                    <MenuItem value="request">Request</MenuItem>
                                </Select>
                                {formik.touched.type && Boolean(formik.errors.type) && (
                                    <FormHelperText>{formik.errors.type}</FormHelperText>
                                )}
                            </FormControl>

                            <FormControl
                                size="small"
                                style={{ width: "22%" }}
                                error={formik.touched.status && Boolean(formik.errors.status)}
                            >
                                <InputLabel id="status">Status</InputLabel>
                                <Select
                                    labelId="status"
                                    name="status"
                                    id="status"
                                    value={formik.initialValues.status}
                                    label="Status"
                                    onChange={fieldChangeHandler}
                                >
                                    <MenuItem value="New">New</MenuItem>
                                    <MenuItem value="Viewed by PM">Viewed by PM</MenuItem>
                                    <MenuItem value="Submitted by PM">Submitted by PM</MenuItem>
                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                    <MenuItem value="Done">Done</MenuItem>
                                </Select>
                                {formik.touched.status && Boolean(formik.errors.status) && (
                                    <FormHelperText>{formik.errors.status}</FormHelperText>
                                )}
                            </FormControl>

                            <FormControl
                                size="small"
                                style={{ width: "22%" }}
                                error={formik.touched.priority && Boolean(formik.errors.priority)}
                            >
                                <InputLabel id="priority">Priority</InputLabel>
                                <Select
                                    labelId="priority"
                                    name="priority"
                                    id="priority"
                                    value={formik.initialValues.priority}
                                    label="Priority"
                                    onChange={fieldChangeHandler}
                                >
                                    <MenuItem value="Minor">Minor</MenuItem>
                                    <MenuItem value="Low">Low</MenuItem>
                                    <MenuItem value="Medium">Medium</MenuItem>
                                    <MenuItem value="High">High</MenuItem>
                                    <MenuItem value="Blocker">Blocker</MenuItem>
                                </Select>
                                {formik.touched.priority && Boolean(formik.errors.priority) && (
                                    <FormHelperText>{formik.errors.priority}</FormHelperText>
                                )}
                            </FormControl>
                            <FormControl size="small" style={{ width: "22%" }}>
                                <InputLabel id="platform">Platform</InputLabel>
                                <Select
                                    labelId="platform"
                                    name="platform"
                                    id="platform"
                                    value={formik.initialValues.platform}
                                    label="Platform"
                                    onChange={fieldChangeHandler}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="Admin">Admin</MenuItem>
                                    <MenuItem value="Application">Application</MenuItem>
                                    <MenuItem value="Web">Web</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl size="small" style={{ width: "22%", marginTop: "15px" }}>
                                <InputLabel id="product">Product</InputLabel>
                                <Select
                                    labelId="product"
                                    name="product"
                                    id="product"
                                    value={formik.initialValues.product}
                                    label="Product"
                                    onChange={fieldChangeHandler}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="ProTools">ProTools</MenuItem>
                                    <MenuItem value="Core">Core</MenuItem>
                                    <MenuItem value="SecureTrade">SecureTrade</MenuItem>
                                    <MenuItem value="Verticals">Verticals</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                id="platformVersion"
                                name="platformVersion"
                                label="Platform Version"
                                size="small"
                                value={formik.initialValues.platformVersion}
                                onChange={fieldChangeHandler}
                                error={
                                    formik.touched.platformVersion &&
                                    Boolean(formik.errors.platformVersion)
                                }
                                helperText={
                                    formik.touched.platformVersion && formik.errors.platformVersion
                                }
                                style={{ width: "22%", marginTop: "15px" }}
                            />
                            {members && (
                                <Autocomplete
                                    size="small"
                                    multiple
                                    id="fixed-tags-demo"
                                    value={assignedTo}
                                    onChange={(event, newValue) => {
                                        setAssignedTo([...newValue]);
                                    }}
                                    options={members.filter(
                                        ({ user_id: id1 }) =>
                                            !assignedTo.some(({ user_id: id2 }) => id2 === id1)
                                    )}
                                    getOptionLabel={option => option.name}
                                    filterSelectedOptions
                                    renderTags={(tagValue, getTagProps) =>
                                        tagValue.map((option, index) => (
                                            <Chip
                                                avatar={<Avatar alt={option.name} />}
                                                label={option.name}
                                                size="small"
                                                {...getTagProps({ index })}
                                                //@ts-ignore
                                                disabled={option === state.appUser}
                                            />
                                        ))
                                    }
                                    style={{
                                        width: "48%",
                                        marginTop: "15px",
                                        marginBottom: "15px",
                                    }}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            label="Assigned To"
                                            placeholder="Select Member"
                                        />
                                    )}
                                />
                            )}
                        </div>
                        <div>
                            <Button
                                color="error"
                                variant="contained"
                                fullWidth
                                style={{ width: "40%", marginRight: "10px" }}
                                disabled={isLoading}
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="success"
                                variant="contained"
                                fullWidth
                                type="submit"
                                style={{ width: "40%", marginLeft: "10px" }}
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={25} /> : "Update"}
                            </Button>
                        </div>
                    </form>
                </Grid>
                <Grid item md={4} mt={2}>
                    <ImageUpload images={images} setImages={setImages} />
                </Grid>
            </Grid>
        </>
    );
};

export default EditItem;
