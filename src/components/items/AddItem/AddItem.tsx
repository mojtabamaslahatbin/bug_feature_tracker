import React, {useEffect, useLayoutEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {v4} from "uuid";
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
    Chip,
    Grid,
} from "@mui/material";
import {useFormik} from "formik";
import * as yup from "yup";
import {useDispatch, useSelector} from 'react-redux'

import {supabase} from "../../../database/Database";
import ImageUpload from "./ImageUpload";
import Loading from "../../Loading/Loading";

import {PersonInterface} from "../../../Types/types";
import {InitialStateType} from "../../../store/reducers/items";
import * as actionTypes from "../../../store/actions/actionTypes";

export const validationSchema = yup.object({
    title: yup.string().required("required"),
    description: yup.string().required("required"),
    type: yup.string().required("required"),
    status: yup.string().required("required"),
    priority: yup.string().required("required"),
    product: yup.string(),
    platform: yup.string(),
    platformVersion: yup.string(),
    dateAdded: yup.string(),
    assignedTo: yup.array(),
});

const AddItem = () => {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [images, setImages] = useState<string>("[]");
    const [members, setMembers] = useState<PersonInterface[] | null>(null);
    const [assignedTo, setAssignedTo] = useState<PersonInterface[] | []>([]);

    const state = useSelector((state: InitialStateType) => state)
    const dispatch = useDispatch()
    const dispatchFlashMessage = (message: string, type: "success" | "error") => dispatch(actionTypes.showFlashMessage(message, type))
    const dispatchAddItemSucceed = () => dispatch(actionTypes.addItemSucceed())

    const navigate = useNavigate();
    // TODO:[question] is it better approach to fetch members in App.tsx components at first to loading addItem component faster?

    useLayoutEffect(() => {
        setIsLoading(true);
        const fetchUsers = async () => {
            try {
                const {data, error} = await supabase.from("users").select().order("name", {ascending: true});
                if (error) {
                    dispatchFlashMessage(`${error.message}`, "error")
                } else {
                    setMembers(data);
                }
            } catch (e) {
                dispatchFlashMessage("Fetching Users Failed", "error")
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
        if (state.appUser) setAssignedTo([state.appUser]);
    }, [state.appUser]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const list = localStorage.getItem("bug-tracker-image");
        if (list !== null) {
            setImages(list);
        }
    }, [setImages]);

    const formik = useFormik({
        initialValues: {
            type: "",
            title: "",
            description: "",
            status: "",
            priority: "",
            product: "",
            platform: "",
            platformVersion: "",
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            async function addItemToDB() {
                setSubmitting(true);
                try {
                    const {data, error} = await supabase.from("items").insert([
                        {
                            ...values,
                            assignedTo,
                            images,
                            id: v4(),
                            dateAdded: Date.now(),
                            addedBy: state.appUser,
                            user_id: supabase.auth.user()?.id,
                        },
                    ]);
                    if (error) {
                        dispatchFlashMessage(`${error.message}`, "error")
                    } else {
                        setSubmitting(false);
                        formik.resetForm();
                        dispatchAddItemSucceed()
                        dispatchFlashMessage("Item Added Successfully", "success")
                        if (state.appUser) setAssignedTo([state.appUser]);
                        setImages("[]");
                        localStorage.removeItem("bug-tracker-image");
                        navigate(`/item/${data[0].id}`);
                    }
                } catch (e) {
                    dispatchFlashMessage("Adding Item Failed", "error")
                } finally {
                    setSubmitting(false);
                }
            }

            addItemToDB();
        },
    });

    return (
        <>
            {isLoading ? (
                <Loading/>
            ) : (
                <Grid container direction="row">
                    <Grid item md={12}>
                        <Typography variant="h5" component="div" align="left" mb={1}>
                            Add Bug Or Feature Request
                        </Typography>
                        <Divider/>
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
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                                style={{marginBottom: "10px", width: "90%"}}
                                autoFocus
                            />
                            <TextField
                                id="description"
                                name="description"
                                label="description"
                                size="small"
                                multiline
                                rows={4}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.description && Boolean(formik.errors.description)
                                }
                                helperText={formik.touched.description && formik.errors.description}
                                style={{marginBottom: "10px", width: "90%"}}
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
                                    style={{width: "22%"}}
                                    error={formik.touched.type && Boolean(formik.errors.type)}
                                >
                                    <InputLabel id="type">Type</InputLabel>
                                    <Select
                                        labelId="type"
                                        name="type"
                                        id="type"
                                        value={formik.values.type}
                                        label="Type"
                                        onChange={formik.handleChange}
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
                                    style={{width: "22%"}}
                                    error={formik.touched.status && Boolean(formik.errors.status)}
                                >
                                    <InputLabel id="status">Status</InputLabel>
                                    <Select
                                        labelId="status"
                                        name="status"
                                        id="status"
                                        value={formik.values.status}
                                        label="Status"
                                        onChange={formik.handleChange}
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
                                    style={{width: "22%"}}
                                    error={
                                        formik.touched.priority && Boolean(formik.errors.priority)
                                    }
                                >
                                    <InputLabel id="priority">Priority</InputLabel>
                                    <Select
                                        labelId="priority"
                                        name="priority"
                                        id="priority"
                                        value={formik.values.priority}
                                        label="Priority"
                                        onChange={formik.handleChange}
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
                                <FormControl size="small" style={{width: "22%"}}>
                                    <InputLabel id="platform">Platform</InputLabel>
                                    <Select
                                        labelId="platform"
                                        name="platform"
                                        id="platform"
                                        value={formik.values.platform}
                                        label="Platform"
                                        onChange={formik.handleChange}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="Admin">Admin</MenuItem>
                                        <MenuItem value="Application">Application</MenuItem>
                                        <MenuItem value="Web">Web</MenuItem>
                                    </Select>
                                    <FormHelperText>Optional</FormHelperText>
                                </FormControl>
                                <FormControl
                                    size="small"
                                    style={{width: "22%", marginTop: "15px"}}
                                >
                                    <InputLabel id="product">Product</InputLabel>
                                    <Select
                                        labelId="product"
                                        name="product"
                                        id="product"
                                        value={formik.values.product}
                                        label="Product"
                                        onChange={formik.handleChange}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="ProTools">ProTools</MenuItem>
                                        <MenuItem value="Core">Core</MenuItem>
                                        <MenuItem value="SecureTrade">SecureTrade</MenuItem>
                                        <MenuItem value="Verticals">Verticals</MenuItem>
                                    </Select>
                                    <FormHelperText>Optional</FormHelperText>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    id="platformVersion"
                                    name="platformVersion"
                                    label="Platform Version"
                                    size="small"
                                    value={formik.values.platformVersion}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.platformVersion &&
                                        Boolean(formik.errors.platformVersion)
                                    }
                                    helperText="Optional"
                                    style={{width: "22%", marginTop: "15px"}}
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
                                            ({user_id: id1}) =>
                                                !assignedTo.some(({user_id: id2}) => id2 === id1)
                                        )}
                                        // options={members.filter(mem => mem.name !== appUser?.name)}
                                        getOptionLabel={option => option.name}
                                        filterSelectedOptions
                                        renderTags={(tagValue, getTagProps) =>
                                            tagValue.map((option, index) => (
                                                <Chip
                                                    avatar={<Avatar alt={option.name}/>}
                                                    label={option.name}
                                                    size="small"
                                                    {...getTagProps({index})}
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
                            <Button
                                color="primary"
                                variant="contained"
                                fullWidth
                                type="submit"
                                style={{width: "20%"}}
                                disabled={submitting}
                            >
                                {submitting ? <CircularProgress size={25}/> : "Add"}
                            </Button>
                        </form>
                    </Grid>
                    <Grid item md={4} mt={2}>
                        <ImageUpload
                            images={images}
                            setImages={setImages}
                        />
                    </Grid>
                </Grid>
            )}
        </>
    );
};

export default AddItem;
