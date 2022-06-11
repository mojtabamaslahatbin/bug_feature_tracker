import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
    Button,
    Box,
    Typography,
    Container,
    IconButton,
    OutlinedInput,
    InputAdornment,
    FormControl,
    CssBaseline,
    TextField,
    CircularProgress,
    InputLabel,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import img from "../../assets/Images/icon.png";
import { supabase } from "../../database/Database";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as actionTypes from "../../store/actions/actionTypes";

const theme = createTheme();

const ResetPassword: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string>("");

    const dispatch = useDispatch();
    const dispatchFlashMessage = (message: string, type: "success" | "error") =>
        dispatch(actionTypes.showFlashMessage(message, type));
    const dispatchUserLoggedIn = useCallback(
        () => dispatch(actionTypes.userLoggedIn()),
        [dispatch]
    );

    const navigate = useNavigate();
    const newPasswordRef = useRef<HTMLInputElement>();
    const confirmNewPasswordRef = useRef<HTMLInputElement>();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // const token = supabase.auth.session()?.access_token
        // if (token) supabase.auth.setAuth(token);
        if (
            newPasswordRef.current?.value.toString().trim() !== "" &&
            confirmNewPasswordRef.current?.value.toString().trim() ===
                newPasswordRef.current?.value.toString().trim()
        ) {
            setIsLoading(true);
            try {
                const { error } = await supabase.auth.update({
                    password: newPasswordRef.current?.value.toString(),
                });
                if (error) {
                    dispatchFlashMessage(`${error.message}`, "error");
                } else {
                    dispatchUserLoggedIn();
                    navigate("/");
                    dispatchFlashMessage("password changed successfully", "success");
                }
            } catch (e: any) {
                console.log(e);
            } finally {
                setIsLoading(false);
            }
        } else {
            dispatchFlashMessage("new password and confirm password should be same", "error");
        }
    };

    useEffect(() => {
        const userData = supabase.auth.user();
        if (userData !== null) {
            const { email } = userData;
            if (email !== undefined) {
                setUserEmail(email);
            }
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <img src={img} alt="icon" width="64px" />
                    <Typography component="h1" variant="h5">
                        Change Password
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            // inputRef={emailRef}
                            value={userEmail}
                            disabled
                        />
                        <FormControl sx={{ width: "100%", mt: 2 }} variant="outlined">
                            <InputLabel htmlFor="newPassword">New Password</InputLabel>
                            <OutlinedInput
                                disabled
                                required
                                fullWidth
                                id="newPassword"
                                name="newPassword"
                                label="New Password"
                                type={showNewPassword ? "text" : "password"}
                                inputRef={newPasswordRef}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            edge="end"
                                        >
                                            {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <FormControl sx={{ width: "100%", mt: 2 }} variant="outlined">
                            <InputLabel htmlFor="confirmNewPassword">
                                Confirm New Password
                            </InputLabel>
                            <OutlinedInput
                                disabled
                                required
                                fullWidth
                                id="confirmNewPassword"
                                name="confirmNewPassword"
                                label="Confirm New Password"
                                type={showConfirmNewPassword ? "text" : "password"}
                                inputRef={confirmNewPasswordRef}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() =>
                                                setShowConfirmNewPassword(!showConfirmNewPassword)
                                            }
                                            edge="end"
                                        >
                                            {showConfirmNewPassword ? (
                                                <Visibility />
                                            ) : (
                                                <VisibilityOff />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>

                        {/* <FormControlLabel
                            control={
                                <Checkbox
                                    value="remember"
                                    color="primary"
                                    onChange={rememberMeHandler}
                                />
                            }
                            label="Remember me"
                        /> */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {isLoading ? <CircularProgress size={25} /> : "Change Password"}
                        </Button>
                        {/* <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid> */}
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default ResetPassword;
