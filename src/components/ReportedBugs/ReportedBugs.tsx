import React, {useEffect, useState} from "react";
import {useSelector} from 'react-redux'
import {
    ToggleButtonGroup,
    LinearProgress,
    ToggleButton,
    Typography,
    Divider,
    Grid,
    Box,
} from "@mui/material";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import ViewListIcon from "@mui/icons-material/ViewList";

import ItemCard from "../ItemCard/ItemCard";
import Table from "../Table/Table";
import {ItemInterface} from "../../Types/types";
import {InitialStateType} from "../../store/reducers/items";

const ReportedBugs = () => {
    const [bugs, setBugs] = useState<ItemInterface[] | undefined>(undefined);
    const [viewMode, setViewMode] = useState<string>("card");


    const state = useSelector((state: InitialStateType) => state)

    useEffect(() => {
        const filteredItems = state.items?.filter((item) => item.type === "bug")
        setBugs(filteredItems);

        const selectViewMode = localStorage.getItem("bugViewMode");
        if (selectViewMode !== null) {
            setViewMode(selectViewMode);
        }
    }, [state.items]);

    const handleViewMode = (
        event: React.MouseEvent<HTMLElement>,
        newViewMode: "card" | "table" | null
    ) => {
        if (newViewMode !== null) {
            setViewMode(newViewMode);
            localStorage.setItem("bugViewMode", newViewMode);
        }
    };

    return (
        <>
            <Grid container>
                <Grid item xs={12} sx={{display: "flex", justifyContent: "space-between", mb: 1}}>
                    <Typography variant="h5" component="div" align="left">
                        Reported Bugs
                    </Typography>
                    <ToggleButtonGroup
                        value={viewMode}
                        color="primary"
                        exclusive
                        size="small"
                        onChange={handleViewMode}
                        aria-label="View Mode"
                    >
                        <ToggleButton value="card" aria-label="Card View">
                            <ViewComfyIcon/>
                        </ToggleButton>
                        <ToggleButton value="table" aria-label="Table View">
                            <ViewListIcon/>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={12}>
                    <Divider/>
                </Grid>
                <Grid item xs={12}>
                    {state.isLoading ? (
                        <Box sx={{width: "100%"}}>
                            <LinearProgress/>
                        </Box>
                    ) : viewMode === "card" ? (
                        <Grid container spacing={1} mt={1}>
                            {(bugs?.length) ? (
                                bugs.map((bugItem, index) => {
                                    return <ItemCard key={index} item={bugItem}/>;
                                })
                            ) : (
                                <p>No Bug Reported</p>
                            )}
                        </Grid>
                    ) : (
                        <Grid container spacing={1} mt={2}>
                            {bugs && <Table items={bugs}/>}
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default ReportedBugs;
