import React, {useEffect, useState} from "react";
import {useDispatch} from 'react-redux'
import {
    CircularProgress,
    FormHelperText,
    FormControl,
    Typography,
    InputLabel,
    TextField,
    MenuItem,
    Divider,
    Button,
    Select,
    Grid,
} from "@mui/material";
import {useFormik} from "formik";
import * as yup from "yup";

import {supabase} from "../../database/Database";
import * as actionTypes from '../../store/actions/actionTypes'

const validationSchema = yup.object({
    email: yup.string().email().required("required"),
    user_id: yup.string().required("required"),
    name: yup.string().required("required"),
    role: yup.string().required("required"),
    access: yup.string().required("required"),
});

const AdminPanel: React.FC = () => {
    const [submitting, setSubmitting] = useState<boolean>(false);

    const dispatch = useDispatch()
    const dispatchFlashMessage = (message: string, type: "success" | "error") => dispatch(actionTypes.showFlashMessage(message, type))

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const formik = useFormik({
        initialValues: {
            email: "",
            user_id: "",
            name: "",
            role: "",
            access: "",
        },
        validationSchema: validationSchema,

        onSubmit: values => {
            setSubmitting(true);

            async function createUser() {
                const newUser = {
                    email: values.email,
                    user_id: values.user_id,
                    name: values.name,
                    role: values.role,
                    access: values.access,
                };
                try {
                    const {error} = await supabase.from("users").insert([newUser]);
                    if (error) {
                        dispatchFlashMessage(`${error.message}`, "error")
                    } else {
                        dispatchFlashMessage("New User Added To DB Successfully", "success")
                        formik.resetForm();
                    }
                } catch (e) {
                    console.error(e);
                    dispatchFlashMessage("Error In Sending Request for Adding User To DB", "error")
                } finally {
                    setSubmitting(false);
                }
            }

            createUser();
        },
    });
    return (
        <>
            <Grid container direction="row">
                <Grid item xs={12}>
                    <Typography variant="h5" component="div" align="left" mb={1}>
                        Add User
                    </Typography>
                    <Divider/>
                </Grid>
                <Grid item xs={12} mt={2}>
                    <form
                        onSubmit={formik.handleSubmit}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                        }}
                    >
                        <TextField
                            id="email"
                            name="email"
                            label="Email"
                            size="small"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            style={{marginBottom: "10px", width: "40%"}}
                            autoFocus
                        />
                        <TextField
                            id="user_id"
                            name="user_id"
                            label="User Id"
                            size="small"
                            rows={4}
                            value={formik.values.user_id}
                            onChange={formik.handleChange}
                            error={formik.touched.user_id && Boolean(formik.errors.user_id)}
                            helperText={formik.touched.user_id && formik.errors.user_id}
                            style={{marginBottom: "10px", width: "40%"}}
                        />
                        <TextField
                            id="name"
                            name="name"
                            label="Name"
                            size="small"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            style={{marginBottom: "10px", width: "40%"}}
                        />

                        <FormControl
                            size="small"
                            style={{width: "40%", marginBottom: "10px"}}
                            error={formik.touched.role && Boolean(formik.errors.role)}
                        >
                            <InputLabel id="role">Role</InputLabel>
                            <Select
                                labelId="role"
                                name="role"
                                id="role"
                                value={formik.values.role}
                                label="Role"
                                onChange={formik.handleChange}
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="callCenter">CallCenter</MenuItem>
                                <MenuItem value="tech">Tech</MenuItem>
                                <MenuItem value="qc">QC</MenuItem>
                                <MenuItem value="product">Product</MenuItem>
                            </Select>
                            {formik.touched.role && Boolean(formik.errors.role) && (
                                <FormHelperText>{formik.errors.role}</FormHelperText>
                            )}
                        </FormControl>
                        <FormControl
                            size="small"
                            style={{width: "40%", marginBottom: "10px"}}
                            error={formik.touched.access && Boolean(formik.errors.access)}
                        >
                            <InputLabel id="access">Access</InputLabel>
                            <Select
                                labelId="access"
                                name="access"
                                id="access"
                                value={formik.values.access}
                                label="Access"
                                onChange={formik.handleChange}
                            >
                                <MenuItem value="user">User</MenuItem>
                                <MenuItem value="superUser">Super User</MenuItem>
                                <MenuItem value="fullAccess">Full Access</MenuItem>
                            </Select>
                            {formik.touched.access && Boolean(formik.errors.access) && (
                                <FormHelperText>{formik.errors.access}</FormHelperText>
                            )}
                        </FormControl>
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
            </Grid>
        </>
    );
};
export default AdminPanel;
