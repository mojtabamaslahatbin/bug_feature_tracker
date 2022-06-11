import React, {useCallback, useLayoutEffect, useRef, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux'
import {
    CircularProgress,
    InputAdornment,
    OutlinedInput,
    CssBaseline,
    FormControl,
    Typography,
    IconButton,
    InputLabel,
    TextField,
    Container,
    Button,
    Grid,
    Box,
} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Visibility, VisibilityOff} from "@mui/icons-material";

import img from "../../assets/Images/icon.png";
import {supabase} from "../../database/Database";
import {InitialStateType} from "../../store/reducers/items";
import * as actionTypes from '../../store/actions/actionTypes'


const theme = createTheme();

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const state = useSelector((state: InitialStateType) => state)
    const dispatch = useDispatch()
    const dispatchStartFetching = () => dispatch(actionTypes.startFetching())
    const dispatchEndFetching = () => dispatch(actionTypes.endFetching())
    const dispatchUserLoggedIn = useCallback(() => dispatch(actionTypes.userLoggedIn()), [dispatch])
    const dispatchFlashMessage = (message: string, type: "success" | "error") => dispatch(actionTypes.showFlashMessage(message, type))

    const navigate = useNavigate();
    const emailRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();

    useLayoutEffect(() => {
        if (supabase.auth.session()) {
            dispatchUserLoggedIn()
            navigate('/')
        }
    }, [dispatchUserLoggedIn]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const email = emailRef.current?.value.toString()
        const password = passwordRef.current?.value.toString()

        if (email?.trim() !== "" && password?.trim() !== "") {
            try {
                dispatchStartFetching()
                const {session, error} = await supabase.auth.signIn({
                    email: emailRef.current?.value.toString(),
                    password: passwordRef.current?.value.toString()
                });
                if (error) {
                    if (error.status === 400) {
                        dispatchFlashMessage("username or password is wrong", "error")
                    }
                } else {
                    if (session !== null) {
                        dispatchUserLoggedIn()
                        dispatchFlashMessage("Welcome ;)", "success")
                        navigate("/");
                    }
                }
            } catch (e: any) {
                dispatchFlashMessage(`${e}`, "error")
            } finally {
                dispatchEndFetching()
            }
        } else {
            dispatchFlashMessage("username and password should not be empty", "error")
        }
    };

    // const rememberMeHandler = (e: any) => {
    // };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: '25vh',
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <img src={img} alt="icon" width="64px"/>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 4, minWidth: '25vw',}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            inputRef={emailRef}
                        />
                        <FormControl
                            sx={{width: '100%', mt: 1}}
                            variant="outlined"
                        >
                            <InputLabel htmlFor="newPassword">Password</InputLabel>
                            <OutlinedInput
                                autoComplete="current-password"
                                required
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                inputRef={passwordRef}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility/> : <VisibilityOff/>}
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
                            disabled={state.isLoading}
                            fullWidth
                            variant="contained"
                            sx={{mt: 1, mb: 2}}
                        >
                            {state.isLoading ? <CircularProgress size={25}/> : "Login"}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Typography variant="body2">
                                    <Link to="/magic-link">
                                        Forgot password?
                                    </Link>
                                </Typography>

                            </Grid>
                            {/*<Grid item>*/}
                            {/*    <Typography variant="body2">*/}
                            {/*        <Link to="#">*/}
                            {/*            {"Don't have an account? Sign Up"}*/}
                            {/*        </Link>*/}
                            {/*    </Typography>*/}
                            {/*</Grid>*/}
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Login;
