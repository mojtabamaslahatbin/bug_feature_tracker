import React, {useEffect, useState} from "react";
import {useSelector} from 'react-redux'

import {
    Box,
    Divider,
    Grid,
    LinearProgress,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";

import Table from "../Table/Table";

import {ItemInterface, ViewMode} from "../../Types/types";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import ViewListIcon from "@mui/icons-material/ViewList";
import ItemCard from "../ItemCard/ItemCard";
import {InitialStateType} from "../../store/reducers/items";


const MyItems: React.FC = () => {
    const [userItems, setUserItems] = useState<ItemInterface[] | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>("card");

    const state = useSelector((state: InitialStateType) => state)

    useEffect(() => {
        if (state.items) {
            const cloneItems = [...state.items];
            const filteredItems = cloneItems.filter(
                item => item.addedBy?.user_id === state.appUser?.user_id
            );
            setUserItems(filteredItems);
        }
    }, [state.items]);

    const handleViewMode = (
        event: React.MouseEvent<HTMLElement>,
        newViewMode: ViewMode | null
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
                        My Reported Bugs And Technical Requests
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
                            {userItems?.length ? (
                                userItems.map((userItem, index) => {
                                    return <ItemCard key={index} item={userItem}/>;
                                })
                            ) : (
                                <p>No Item</p>
                            )}
                        </Grid>
                    ) : (
                        <Grid container spacing={1} mt={2}>
                            {userItems && <Table items={userItems}/>}
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default MyItems;
