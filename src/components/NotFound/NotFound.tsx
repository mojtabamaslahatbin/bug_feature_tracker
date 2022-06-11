import React from "react";
import {Grid, Typography} from "@mui/material";
import {Link} from "react-router-dom";


type Props = {};

const NotFound = (props: Props) => {
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{minHeight: "70vh"}}
        >
            <Grid item sm={12}>
                <Typography variant="h3">
                    Not Found !
                </Typography>
                <Typography align='center' mt={6}>
                    <Link to='/'> Home Page</Link>
                </Typography>
            </Grid>
        </Grid>
    );
};

export default NotFound;
