import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { connect } from "react-redux";
import { logout } from '../store/actions/authActions';
import { useNavigate } from 'react-router-dom';

function MenuAppBar({ auth, logout }) {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState(null);

    var token = auth.token || '';
    var header = token.split(' ')
    var role = header[0]

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        logout();
    };

    const handleMyCourses = () => {
        setAnchorEl(null);
        navigate("/courses/student");
    };

    const handleAllCourses = () => {
        setAnchorEl(null);
        navigate("/courses");
    };

    const handleHome = () => {
        setAnchorEl(null);
        navigate("/");
    };
    const routeChange = () => {
        setAnchorEl(null);
        let path = "/" + role + "/profile";
        navigate(path);
    };
    const routeLogin = () => {
        setAnchorEl(null);
        logout();
    }


    return (
        <Box sx={{ flexGrow: 1, marginBottom: 2, bgColor: "var(--primaryColor)", color: "var(--secColor)" }}>
            {auth.user && (
                <AppBar position="static" color='inherit'>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={handleMenu}
                        >
                            <MenuIcon />
                        </IconButton>
                        {role !== "Guest" && (
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >

                                <MenuItem onClick={handleHome}>Home</MenuItem>
                                <MenuItem onClick={handleMyCourses}>My Courses</MenuItem>
                                <MenuItem onClick={handleAllCourses}>Courses Menu</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>

                            </Menu>
                        )}
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            CanCham Online Learning System
                        </Typography>


                        {role !== "Guest" ? (<>
                            <AccountCircle onClick={routeChange} sx={{ cursor: 'pointer' }} />
                            <Typography marginLeft={"5px"} onClick={routeChange} sx={{ cursor: 'pointer' }}>{auth.user.username}</Typography>
                        </>) : (<>
                            <AccountCircle onClick={routeLogin} sx={{ cursor: 'pointer' }} />
                            <Typography marginLeft={"5px"} onClick={routeChange} sx={{ cursor: 'pointer' }}>Login</Typography>
                        </>)}
                    </Toolbar>
                </AppBar>
            )}
        </Box>
    );
}

const mapStateToProps = (state) => ({
    auth: state?.auth
});

const mapDispatchToProps = { logout };

export default connect(mapStateToProps, mapDispatchToProps)(MenuAppBar);