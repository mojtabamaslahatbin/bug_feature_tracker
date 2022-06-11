import React from "react";
import {styled, useTheme, Theme, CSSObject} from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import {Icon} from "@iconify/react";
import {NavLink} from "react-router-dom";
import {Tooltip} from "@mui/material";
import Header from "../Header/Header";
import {useSelector} from 'react-redux'
import {InitialStateType} from "../../store/reducers/items";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: prop => prop !== "open"})(
    ({theme, open}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        ...(open && {
            ...openedMixin(theme),
            "& .MuiDrawer-paper": openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            "& .MuiDrawer-paper": closedMixin(theme),
        }),
    })
);

const SideDrawer: React.FC = () => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const state = useSelector((state: InitialStateType) => state)

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box
            sx={{
                display: "flex",
            }}
        >
            <CssBaseline/>
            <Header
                open={open}
                handleDrawerOpen={handleDrawerOpen}
            />
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === "rtl" ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </DrawerHeader>
                <Divider/>
                <List sx={{mt: 8}}>
                    {[
                        {
                            title: "Home",
                            icon: "fa-solid:home",
                            path: "",
                        },
                        {title: "Reported Bugs", icon: "fa6-solid:bug", path: "bugs"},
                        {
                            title: "Technical Requests",
                            icon: "icon-park-solid:computer",
                            path: "requests",
                        },
                        {
                            title: "Add New Item",
                            icon: "fluent:calendar-add-28-filled",
                            path: "add-item",
                        },
                        {
                            title: "My Items",
                            icon: "ph:user-list-fill",
                            path: "/my-items",
                        },
                        {
                            title: "Assigned To Me",
                            icon: "ri:user-received-fill",
                            path: "/assigned-to-me",
                        },
                        {
                            title: "Reports",
                            icon: "fluent:chart-multiple-24-filled",
                            path: "reports",
                        },
                    ].map((item, index) => (
                        <ListItem key={index} disablePadding sx={{display: "block"}}>
                            <NavLink
                                to={item.path}
                                style={({isActive}) => ({
                                    color: isActive ? "#1976d2" : "rgba(0, 0, 0, 0.705)",
                                    textDecoration: "none",
                                })}
                            >
                                {!open ? (
                                    <Tooltip
                                        title={item.title}
                                        placement="right"
                                        sx={{zIndex: 1000}}
                                    >
                                        <ListItemButton
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: open ? "initial" : "center",
                                                px: 2.5,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    minWidth: 0,
                                                    marginRight: open ? "15px" : "auto",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Icon
                                                    icon={item.icon}
                                                    inline={true}
                                                    fontSize={24}
                                                />
                                            </span>
                                            <ListItemText
                                                primary={item.title}
                                                sx={{opacity: open ? 1 : 0}}
                                            />
                                        </ListItemButton>
                                    </Tooltip>
                                ) : (
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? "initial" : "center",
                                            px: 2.5,
                                        }}
                                    >
                                        <span
                                            style={{
                                                minWidth: 0,
                                                marginRight: open ? "15px" : "auto",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Icon icon={item.icon} inline={true} fontSize={24}/>
                                        </span>
                                        <ListItemText
                                            primary={item.title}
                                            sx={{opacity: open ? 1 : 0}}
                                        />
                                    </ListItemButton>
                                )}
                            </NavLink>
                        </ListItem>
                    ))}
                </List>
                <Divider/>
                {state.appUser?.access === "fullAccess" && (
                    <List>
                        {[
                            {
                                title: "Admin Panel",
                                icon: "material-symbols:admin-panel-settings-rounded",
                                path: "admin-panel",
                            },
                        ].map((item, index) => (
                            <ListItem key={index} disablePadding sx={{display: "block"}}>
                                <NavLink
                                    to={item.path}
                                    style={({isActive}) => ({
                                        color: isActive ? "#1976d2" : "rgba(0, 0, 0, 0.705)",
                                        textDecoration: "none",
                                    })}
                                >
                                    {!open ? (
                                        <Tooltip
                                            title={item.title}
                                            placement="right"
                                            sx={{zIndex: 1000}}
                                        >
                                            <ListItemButton
                                                sx={{
                                                    minHeight: 48,
                                                    justifyContent: open ? "initial" : "center",
                                                    px: 2.5,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        minWidth: 0,
                                                        marginRight: open ? "15px" : "auto",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <Icon
                                                        icon={item.icon}
                                                        inline={true}
                                                        fontSize={24}
                                                    />
                                                </span>
                                                <ListItemText
                                                    primary={item.title}
                                                    sx={{opacity: open ? 1 : 0}}
                                                />
                                            </ListItemButton>
                                        </Tooltip>
                                    ) : (
                                        <ListItemButton
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: open ? "initial" : "center",
                                                px: 2.5,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    minWidth: 0,
                                                    marginRight: open ? "15px" : "auto",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Icon
                                                    icon={item.icon}
                                                    inline={true}
                                                    fontSize={24}
                                                />
                                            </span>
                                            <ListItemText
                                                primary={item.title}
                                                sx={{opacity: open ? 1 : 0}}
                                            />
                                        </ListItemButton>
                                    )}
                                </NavLink>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Drawer>
        </Box>
    );
};

export default SideDrawer;
