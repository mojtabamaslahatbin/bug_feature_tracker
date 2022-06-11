import React from "react";
import {Divider, Grid, Typography} from "@mui/material";
import Chart from "./Chart/Chart";

const Reports: React.FC = () => {
    return (
        <>
            <Grid container spacing={2}>
                <Grid item md={12}>
                    <Typography variant="h5" component="div" align="left" mb={1}>
                        Bugs And Technical Requests Stats <Typography variant="caption">(Developing...)</Typography>
                    </Typography>
                    <Divider/>
                    <Chart/>
                </Grid>
            </Grid>
        </>
    );
};

export default Reports;
