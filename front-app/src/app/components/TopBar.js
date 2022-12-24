import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import StarRateIcon from '@mui/icons-material/StarRate';
import PaidIcon from '@mui/icons-material/Paid';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import DiscountIcon from '@mui/icons-material/Discount';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { connect } from "react-redux";
import { logout } from '../store/actions/authActions';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { centered_flex_box } from './Styles';

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

    const handleInstructorCourses = () => {
        setAnchorEl(null);
        navigate("/courses/instructor");
    };

    const handleInstructorRating = () => {
        setAnchorEl(null);
        let path = "/Instructor/ratings";
        navigate(path);
    };

    const handleCoursesRating = () => {
        setAnchorEl(null);
        let path = "/courses/ratings";
        navigate(path);
    };

    const handleAllCourses = () => {
        setAnchorEl(null);
        navigate("/courses");
    };

    const handleHome = () => {
        setAnchorEl(null);
        navigate("/");
    };

    const handleAllReports = () => {
        setAnchorEl(null);
        let path = "/reports";
        navigate(path);
    };

    const handleReport = () => {
        setAnchorEl(null);
        let path = "/reports/add";
        navigate(path);
    };

    const handleProfile = () => {
        setAnchorEl(null);
        let path = "/" + role + "/profile";
        navigate(path);
    };

    const handleAddUsers = () => {
        setAnchorEl(null);
        let path = "/Admin/addUsers";
        navigate(path);
    };

    const handleCourseRequests = () => {
        setAnchorEl(null);
        let path = "/Admin/requests";
        navigate(path);
    };

    const handleRefundRequests = () => {
        setAnchorEl(null);
        let path = "/Admin/refund";
        navigate(path);
    };

    const handlePromotions = () => {
        setAnchorEl(null);
        let path = "/Admin/promotions";
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

                                <MenuItem onClick={handleHome}><HomeIcon /><Typography marginX={2}>Home</Typography></MenuItem>
                                {role !== "Admin" && <MenuItem onClick={handleProfile}><AccountCircle /><Typography marginX={2}>Profile</Typography></MenuItem>}
                                {(role === "Trainee" || role === "Corporate") && <MenuItem onClick={handleMyCourses}><AutoStoriesIcon /><Typography marginX={2}>My Courses</Typography></MenuItem>}
                                {role === "Instructor" && (<>
                                    <MenuItem onClick={handleInstructorRating}><StarRateIcon /><Typography marginX={2}>My Ratings</Typography></MenuItem>
                                    <MenuItem onClick={handleInstructorCourses}><AutoStoriesIcon /><Typography marginX={2}>My Courses</Typography></MenuItem>
                                    <MenuItem onClick={handleCoursesRating}><LocalActivityIcon /><Typography marginX={2}>My Courses Ratings</Typography></MenuItem>
                                </>)}
                                {role !== "Admin" && <MenuItem onClick={handleAllCourses}><MenuBookIcon /><Typography marginX={2}>Courses Menu</Typography></MenuItem >}
                                <hr />
                                {role === "Admin" && (<>
                                    {/* <Box sx={centered_flex_box}><Typography fontWeight="bold">Admin Actions</Typography></Box> */}
                                    <MenuItem onClick={handleAddUsers}><AccountCircle /><Typography marginX={2}>Add Users</Typography></MenuItem>
                                    <Tooltip placement="right" title="View and respond to trainee refund requests"><MenuItem onClick={handleRefundRequests}><PaidIcon /><Typography marginX={2}>Refund Requests</Typography></MenuItem ></Tooltip>
                                    <Tooltip placement="right" title="View and respond to trainee course access requests"><MenuItem onClick={handleCourseRequests}><MenuBookIcon /><Typography marginX={2}>Course Access Requests</Typography></MenuItem ></Tooltip>
                                    <Tooltip placement="right" title="Issue discounts to courses"><MenuItem onClick={handlePromotions}><DiscountIcon /><Typography marginX={2}>Issue Promotions</Typography></MenuItem ></Tooltip>
                                    <Tooltip placement="right" title="View and respond to reported problems"><MenuItem onClick={handleAllReports}><FlagCircleIcon /><Typography marginX={2}>Reported Problems</Typography></MenuItem ></Tooltip>
                                </>)}
                                {role !== "Admin" && (<>
                                    <Tooltip placement="right" title="View status of your previously reported problems"><MenuItem onClick={handleAllReports}><FlagCircleIcon /><Typography marginX={2}>Reported Problems</Typography></MenuItem ></Tooltip>
                                    <Tooltip placement="right" title="Have an issue? Report it now"><MenuItem onClick={handleReport}><ReportProblemIcon /><Typography marginX={2}>Report a Problem</Typography></MenuItem ></Tooltip>
                                </>)}
                                <hr />
                                <MenuItem onClick={handleLogout}><LogoutIcon /><Typography marginX={2}>Logout</Typography></MenuItem>

                            </Menu >
                        )}
                        <Typography onClick={handleHome} variant="h6" component="div" sx={{ flexGrow: 1, cursor: "pointer" }}>
                            CanCham Online Learning System
                        </Typography>


                        {
                            role !== "Guest" ? (<>
                                <AccountCircle onClick={handleProfile} sx={{ cursor: 'pointer' }} />
                                <Typography marginLeft={"5px"} onClick={handleProfile} sx={{ cursor: 'pointer' }}>{auth.user.username}</Typography>
                            </>) : (<>
                                <AccountCircle onClick={routeLogin} sx={{ cursor: 'pointer' }} />
                                <Typography marginLeft={"5px"} onClick={routeLogin} sx={{ cursor: 'pointer' }}>Login</Typography>
                            </>)
                        }
                    </Toolbar >
                </AppBar >
            )}
        </Box >
    );
}

const mapStateToProps = (state) => ({
    auth: state?.auth
});

const mapDispatchToProps = { logout };

export default connect(mapStateToProps, mapDispatchToProps)(MenuAppBar);