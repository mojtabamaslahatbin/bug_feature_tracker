import React from "react";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {
    ClickAwayListener,
    IconButton,
    Typography,
    InputBase,
    MenuItem,
    Toolbar,
    Divider,
    Avatar,
    Badge,
    Menu,
    Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";

import { supabase } from "../../database/Database";
import { useDispatch, useSelector } from "react-redux";
import { InitialStateType } from "../../store/reducers/items";
import * as actionTypes from "../../store/actions/actionTypes";

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "30ch",
        },
    },
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: prop => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

interface HeaderProps {
    open?: boolean;
    handleDrawerOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleDrawerOpen, open }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
    const [searchTerm, setSearchTerm] = React.useState<string>("");

    const state = useSelector((state: InitialStateType) => state);
    const dispatch = useDispatch();
    const dispatchUserLoggedOut = () => dispatch(actionTypes.userLoggedOut());

    const navigate = useNavigate();
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMyAccountClick = () => {
        setAnchorEl(null);
        navigate("/change-password");
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleItemSearch = (e: React.ChangeEvent<any>) => {
        setSearchTerm(e.target.value);
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        dispatchUserLoggedOut();
        if (error) console.log(error);
    };

    const menuId = "primary-search-account-menu";
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMyAccountClick}>Change Password</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    );

    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        <React.Fragment>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: "none" }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <ClickAwayListener
                        mouseEvent="onMouseDown"
                        touchEvent="onTouchStart"
                        onClickAway={() => setSearchTerm("")}
                    >
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="search in ids , titles or descriptions …"
                                inputProps={{ "aria-label": "search" }}
                                onChange={handleItemSearch}
                            />
                            {searchTerm.length > 0 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        width: "100%",
                                        top: 40,
                                        left: 0,
                                        backgroundColor: "#f1f1f168",
                                        backdropFilter: "blur(15px)",
                                        color: "black",
                                        border: "1px solid #ccc",
                                    }}
                                >
                                    <ul style={{ listStyleType: "none" }}>
                                        {state.items
                                            ?.filter(
                                                item =>
                                                    item.title
                                                        .toLowerCase()
                                                        .includes(searchTerm.toLowerCase()) ||
                                                    item.description
                                                        .toLowerCase()
                                                        .includes(searchTerm.toLowerCase()) ||
                                                    item.id
                                                        .toString()
                                                        .substring(0, 8)
                                                        .toLowerCase()
                                                        .includes(searchTerm.toLowerCase())
                                            )
                                            .map((itm, idx) => {
                                                return (
                                                    <li
                                                        onClick={() => navigate(`/item/${itm.id}`)}
                                                        key={idx}
                                                        style={{
                                                            cursor: "pointer",
                                                            borderBottom: "0.1px solid #e2e2e2",
                                                            marginBottom: "5px",
                                                            paddingBottom: "5px",
                                                            width: "100%",
                                                        }}
                                                    >
                                                        {itm.title}
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                </div>
                            )}
                        </Search>
                    </ClickAwayListener>

                    <Box sx={{ flexGrow: 1 }} />
                    <Typography> {state.appUser?.name}</Typography>
                    <Box sx={{ display: { xs: "none", md: "flex" } }}>
                        {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={0} color="success">
                                <MailIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                        >
                            <Badge badgeContent={0} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton> */}
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <Avatar alt="profile-image" src="" />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </React.Fragment>
    );
};

export default Header;
