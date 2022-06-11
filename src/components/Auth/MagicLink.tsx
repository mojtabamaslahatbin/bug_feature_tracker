import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {useDispatch} from 'react-redux'

import {CssBaseline, CircularProgress, TextField, Button, Box, Typography, Container} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";

import img from "../../assets/Images/icon.png";
import {supabase} from "../../database/Database";
import * as actionTypes from "../../store/actions/actionTypes";

const theme = createTheme();

const MagicLink: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [reqCounter, setReqCounter] = useState<number>(1)

    const dispatch = useDispatch()
    const dispatchFlashMessage = (message: string, type: "success" | "error") => dispatch(actionTypes.showFlashMessage(message, type))


    const emailRef = useRef<HTMLInputElement>();

    useEffect(() => {
        if (reqCounter > 3) {
            const handleTooManyRequests = setTimeout(() => {
                setReqCounter(1)
            }, 60000)
            return () => {
                clearTimeout(handleTooManyRequests)
            }
        }
    }, [reqCounter])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const enteredEmail = emailRef.current?.value.toString()

        if (enteredEmail !== undefined && enteredEmail?.trim() !== '') {
            try {
                setIsLoading(true);
                setReqCounter(reqCounter => ++reqCounter)
                const {error} = await supabase.auth.api.resetPasswordForEmail(enteredEmail)
                if (error) {
                    setIsLoading(false);
                    if (error.status === 404) {
                        dispatchFlashMessage("You are not signed up user", "error")
                    }
                    if (error.status === 429) {
                        dispatchFlashMessage("Too Many Requests. Please Wait For 60s", "error")
                        setReqCounter(4)
                    }
                } else {
                    setIsLoading(false);
                    dispatchFlashMessage("Magic Link Sent", "success")
                }

            } catch (e: any) {
                dispatchFlashMessage("Sending Magic Link Failed", "error")
            }
        } else {
            dispatchFlashMessage("Enter Email Address", "error")
        }

    };

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
                        Login With Magic Link
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
                        <Button
                            type="submit"
                            // disabled={isLoading || showMessage}
                            disabled={reqCounter > 3}
                            fullWidth
                            variant="contained"
                            sx={{mt: 1, mb: 2}}

                        >
                            {isLoading ?
                                <CircularProgress
                                    size={25}/> : (reqCounter > 3) ? "Too Many Requests. Wait for 60s" : "Send Magic Link"}
                        </Button>
                        <Typography variant="body2">
                            <Link to='/login'>Back To Login</Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default MagicLink;
