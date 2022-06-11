import React, {useEffect, useState} from "react";
import {
    Box,
    Divider,
    Grid,
    LinearProgress,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import ItemCard from "../ItemCard/ItemCard";
import {ItemInterface} from "../../Types/types";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import ViewListIcon from "@mui/icons-material/ViewList";
import Table from "../Table/Table";
import {useSelector} from 'react-redux'
import {InitialStateType} from "../../store/reducers/items";

const TechRequests = () => {
    const [requests, setRequests] = useState<ItemInterface[] | undefined>(undefined);
    const [viewMode, setViewMode] = useState<string>("card");

    const state = useSelector((state: InitialStateType) => state)

    useEffect(() => {
        const filteredItems = state.items?.filter(item => item.type === "request");
        setRequests(filteredItems);

        const selectViewMode = localStorage.getItem("requestViewMode");
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
            localStorage.setItem("requestViewMode", newViewMode);
        }
    };

    return (
        <>
            <Grid container>
                <Grid item xs={12} sx={{display: "flex", justifyContent: "space-between", mb: 1}}>
                    <Typography variant="h5" component="div" align="left">
                        Technical Requests
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
                            {requests &&
                            requests.map((reqItem, index) => {
                                return <ItemCard key={index} item={reqItem}/>;
                            })}
                        </Grid>
                    ) : (
                        <Grid container spacing={1} mt={2}>
                            {requests && <Table items={requests}/>}
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default TechRequests;