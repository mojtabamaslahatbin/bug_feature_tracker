import React, { useRef, useState } from "react";

import {
    Button,
    Box,
    Typography,
    Container,
    CssBaseline,
    TextField,
    CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import img from "../../assets/Images/icon.png";
import { supabase } from "../../database/Database";

const theme = createTheme();

const Login: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const emailRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        event.preventDefault();
        // const token = supabase.auth.session()?.access_token
        // if (token) supabase.auth.setAuth(token);
        try {
            // const {data, error} = await supabase.auth.update({password: passwordRef.current?.value.toString()});
            const { user, error } = await supabase.auth.update({
                email: emailRef.current?.value.toString(),
                password: passwordRef.current?.value.toString(),
            });
            if (error) {
                console.log(error);
                // if (error.status === 400) alert("username or password is wrong");
            } else {
                // console.log('data', data)
                console.log("user", user);
                // if (session !== null) {
                //     localStorage.setItem("authToken", session?.access_token);
                //     localStorage.setItem("user", JSON.stringify(session?.user));
                // navigate("/");
                // }
            }
        } catch (e: any) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect(() => {
    //     const {email} = supabase.auth.user()
    //     setUserEmail(email)
    // }, [])

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
                        SIGN UP
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
                            inputRef={emailRef}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            inputRef={passwordRef}
                        />
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
                            {isLoading ? <CircularProgress size={25} /> : "Sign Up"}
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

export default Login;
