import React, {useEffect, useState} from "react";
import {DataGrid, GridColDef, GridToolbar} from "@mui/x-data-grid";
import {ItemInterface} from "../../Types/types";
import {Box, Chip, Tooltip, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {useSelector} from 'react-redux'
import {InitialStateType} from "../../store/reducers/items";

type Props = {
    items: ItemInterface[];
};

const statusPercentCounter = (status: string | undefined) => {
    switch (status) {
        case "New":
            return 20;
        case "Viewed by PM":
            return 40;
        case "Submitted by PM":
            return 60;
        case "In Progress":
            return 80;
        case "Done":
            return 100;
        default:
            return 0;
    }
};

const ProgressBar = (props: { value: string }) => {
    return (
        <Box
            sx={{
                position: "relative",
                width: "90%",
                height: "25px",
                backgroundColor: "#8f62f847",
                borderRadius: "5px",
                display: "flex",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    width: `${statusPercentCounter(props.value)}%`,
                    height: "100%",
                    backgroundColor: "#b698fc",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "5px",
                }}
            >
                <Typography
                    sx={{
                        position: "absolute",
                        fontSize: "0.8rem",
                        pl: 1,
                    }}
                >
                    {props.value}
                </Typography>
            </Box>
        </Box>
    );
};

const columns: GridColDef[] = [
    {field: "row", headerName: "Row", flex: 0.2, headerAlign: "center", align: "center"},
    {
        field: "type",
        headerName: "Type",
        flex: 0.5,
        headerAlign: "center",
        align: "center",
        renderCell: cellValues => {
            return (
                <Tooltip title="Click for Details">
                    <Link to={`/item/${cellValues.row.id}`}>{cellValues.value}</Link>
                </Tooltip>
            );
        },
    },
    {
        field: "title",
        headerName: "Title",
        flex: 3,
        sortable: false,
        headerAlign: "center",
        align: "center",
    },
    {
        field: "priority",
        headerName: "Priority",
        flex: 1,
        renderCell: cellValues => {
            return (
                <Chip
                    label={cellValues.value}
                    sx={{
                        backgroundColor: handleLabelsColor(cellValues.value)?.background,
                        color: handleLabelsColor(cellValues.value)?.text,
                        width: "4.5rem",
                    }}
                    size="small"
                />
            );
        },
        headerAlign: "center",
        align: "center",
    },
    {field: "product", headerName: "Product", flex: 1, headerAlign: "center", align: "center"},
    {field: "platform", headerName: "Platform", flex: 1, headerAlign: "center", align: "center"},
    {
        field: "platformVersion",
        headerName: "Version",
        flex: 0.75,
        headerAlign: "center",
        align: "center",
    },
    {
        field: "status",
        headerName: "Status",
        flex: 1.5,
        headerAlign: "center",
        align: "center",
        renderCell: cellValues => {
            return <ProgressBar value={cellValues.value}/>;
        },
    },
    {
        field: "dateAdded",
        headerName: "Added On",
        flex: 0.75,
        headerAlign: "center",
        align: "center",
    },
    {
        field: "addedBy",
        headerName: "Added By",
        flex: 1,
        headerAlign: "center",
        align: "center",
        renderCell: cellValues => {
            return <p>{cellValues.value.name}</p>;
        },
    },
    // { field: "description", headerName: "Description", width: 300, sortable: false },
    {
        field: "dateDone",
        headerName: "Done On",
        flex: 0.75,
        headerAlign: "center",
        align: "center",
        // renderCell: cellValues => {
        //     console.log(cellValues)
        //     return <p>{cellValues.value}</p>;
        // }
    },
];

const handleLabelsColor = (priority: string) => {
    switch (priority) {
        case "Minor":
            return {background: "#19c4033e", text: "#14af00"};
        case "Low":
            return {background: "#0077ff32", text: "#0044ff"};
        case "Medium":
            return {background: "#ffee0061", text: "#b4a800"};
        case "High":
            return {background: "#ff910053", text: "#e78300"};
        case "Blocker":
            return {background: "#ff000030", text: "#ff0000"};
        case undefined:
            break;
        default:
            break;
    }
};

const Table = ({items}: Props) => {
    const [rowsData, setRowsData] = useState<ItemInterface[] | []>([]);
    const [tableIsLoading, setTableIsLoading] = useState<boolean>(false);

    const state = useSelector((state: InitialStateType) => state)

    useEffect(() => {
        setTableIsLoading(true);
        const rows = [...items];
        const newRows = rows.map((row, idx) => {
            return {
                ...row,
                row: idx + 1,
                dateAdded: new Date(row?.dateAdded).toLocaleDateString(),
                dateDone: row?.dateDone ? new Date(row?.dateDone).toLocaleDateString() : "----",
                addedBy: row?.addedBy,
            };
        });
        setRowsData(newRows);
        setTableIsLoading(false);
    }, [items]);

    return (
        <div
            style={{
                // height: "82vh",
                width: "100%",
            }}
        >
            <DataGrid
                rows={rowsData}
                columns={columns}
                pageSize={30}
                disableSelectionOnClick
                disableColumnMenu
                rowsPerPageOptions={[30]}
                checkboxSelection
                components={{Toolbar: GridToolbar}}
                autoHeight={true}
                loading={tableIsLoading || state.isLoading}
                // initialState={{
                //     sorting: {
                //         sortModel: [{field: "dateAdded", sort: "desc"}],
                //     },
                // }}
            />
        </div>
    );
};

export default Table;
