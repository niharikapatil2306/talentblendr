import { AppBar, Divider, Drawer, IconButton, List, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import logo from "../assets/logo.png";
import { AccountCircle, Edit, Home, ChevronLeft, Logout, EditNote } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { resetState } from "../context/actions";

export default function VerticalNavbarSeeker() {

    const [open, setOpen] = useState(false);
    const isLargeScreen = useMediaQuery('(min-width:600px)');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            dispatch(resetState());
            console.log("User logged out successfully");
            navigate('/')
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <>
            {isLargeScreen ? (
                <Drawer variant="permanent" >
                    <div>
                        <img src={logo} alt="" style={{ height: '5rem', marginBottom: '2rem', marginTop: '1rem' }} />
                    </div>
                    <List>

                        <ListItemButton component={Link} to="/" alignItems="center" sx={{ flexDirection: 'column' }}>
                            <Home sx={{ fontSize: 64 }} />
                            <ListItemText primary="Home" style={{ textAlign: 'center' }} />
                        </ListItemButton>

                        <ListItemButton alignItems="center" sx={{ flexDirection: 'column' }}>
                            <AccountCircle sx={{ fontSize: 64 }} />
                            <ListItemText primary="My Profile" style={{ textAlign: 'center' }} />
                        </ListItemButton>

                        <ListItemButton component={Link} to="/job-board" alignItems="center" sx={{ flexDirection: 'column' }}>
                            <EditNote sx={{ fontSize: 64 }} />
                            <ListItemText primary="Blogs" style={{ textAlign: 'center' }} />
                        </ListItemButton>

                        <ListItemButton onClick={handleLogout} alignItems="center" sx={{ flexDirection: 'column' }}>
                            <Logout sx={{ fontSize: 64 }} />
                            <ListItemText primary="Logout" style={{ textAlign: 'center' }} />
                        </ListItemButton>

                    </List>

                </Drawer>
            ) : (
                <>
                    <AppBar position="fixed">
                        <Toolbar>
                            <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start">
                                <MenuIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <div style={{ marginBottom: '2.5rem' }} />
                    <Drawer variant="temporary" open={open} onClose={handleDrawerClose}>
                        <div>
                            <IconButton onClick={handleDrawerClose}>
                                <ChevronLeft />
                            </IconButton>
                            <img src={logo} alt="" style={{ height: '5rem' }} />
                        </div>
                        <List>
                            <Divider component="li" />
                            <ListItemButton alignItems="center">
                                <Home />
                                <ListItemText primary="Home" style={{ textAlign: 'center' }} />
                            </ListItemButton>
                            <Divider component="li" /><ListItemButton alignItems="center">
                                <AccountCircle />
                                <ListItemText primary="My Profile" style={{ textAlign: 'center' }} />
                            </ListItemButton>
                            <Divider component="li" />
                            <ListItemButton alignItems="center">
                                <Edit />
                                <ListItemText primary="Edit" style={{ textAlign: 'center' }} />
                            </ListItemButton>
                            <Divider component="li" />
                            <ListItemButton alignItems="center">
                                <EditNote />
                                <ListItemText primary="Blog" style={{ textAlign: 'center' }} />
                            </ListItemButton>
                            <Divider component="li" />
                            <ListItemButton alignItems="center" onClick={handleLogout}>
                                <Logout />
                                <ListItemText primary="Logout" style={{ textAlign: 'center' }} />
                            </ListItemButton>
                        </List>
                    </Drawer>
                </>
            )}
        </>
    );
}