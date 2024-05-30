import { AppBar, Divider, Drawer, IconButton, List, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from "react";
import logo from "../assets/logo1.png";
import { AccountCircle, Edit, Home, ChevronLeft, Logout, EditNote } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { resetState } from "../context/actions";
import { collection, getDocs } from "firebase/firestore";

export default function VerticalNavbarSeeker() {

    const [hasScreeningTest, setHasScreeningTest] = useState(false);
    const user = useSelector(state => state.userReducer);
    const recruiterId = user.user.uid;

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

    useEffect(() => {
        const checkScreeningTest = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'screening_test', recruiterId, 'questions'));
                if (!querySnapshot.empty) {
                    setHasScreeningTest(true);
                }
            } catch (error) {
                console.error('Error checking screening test:', error);
            }
        };

        checkScreeningTest();
    }, [recruiterId]);

    return (
        <>
            {isLargeScreen ? (
                <Drawer variant="permanent" >
                    <div>
                        <img src={logo} alt="" style={{ height: '5rem', marginBottom: '2rem', marginTop: '1rem' }} />
                    </div>
                    <List>

                        <ListItemButton component={Link} to="/" alignItems="center" sx={{ flexDirection: 'column' }}>
                            <Home sx={{ fontSize: 54 }} />
                            <ListItemText primary="Home" style={{ textAlign: 'center' }} />
                        </ListItemButton>

                        <ListItemButton alignItems="center" sx={{ flexDirection: 'column' }}>
                            <AccountCircle sx={{ fontSize: 54 }} />
                            <ListItemText primary="My Profile" style={{ textAlign: 'center' }} />
                        </ListItemButton>

                        {hasScreeningTest && (
                            <ListItemButton component={Link} to="/screening_test" alignItems="center" sx={{ flexDirection: 'column' }}>
                                <EditNote sx={{ fontSize: 54 }} />
                                <ListItemText primary="Screening Test" style={{ textAlign: 'center' }} />
                            </ListItemButton>
                        )}

                        <ListItemButton onClick={handleLogout} alignItems="center" sx={{ flexDirection: 'column' }}>
                            <Logout sx={{ fontSize: 54 }} />
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