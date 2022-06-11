import React from "react";
import { CircularProgress, Grid } from "@mui/material";

type Props = {};

const Loading = (props: Props) => {
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "70vh" }}
        >
            <Grid item sm={12}>
                <CircularProgress />
            </Grid>
        </Grid>
    );
};

export default Loading;
