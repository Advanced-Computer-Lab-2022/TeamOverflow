import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Typography, Box, Container, CssBaseline, Button, FormHelperText, Select, MenuItem, Rating, CircularProgress, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../app/store/actions/authActions';
import { centered_flex_box, main_button, right_flex_box } from '../../app/components/Styles';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import StarRateIcon from '@mui/icons-material/StarRate';
import PaidIcon from '@mui/icons-material/Paid';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import DiscountIcon from '@mui/icons-material/Discount';
import LogoutIcon from '@mui/icons-material/Logout';
///import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import { viewRefunds, viewRequests } from '../../app/store/actions/adminActions';

const theme = createTheme();

export const Home = ({ auth, logout, viewRequests, viewRefunds}) => {

  const navigate = useNavigate()


  return (
    <Container component="main" maxWidth="xl">
      <Box className="course-head" sx={{ display: "flex", alighnItems: "flex-start", flexDirection: "column", mx: "-24px", mt: -2, minWidth: "100%", minHeight: "25vh", mb: 2, p: 2 }}>
        <Box sx={{ display: "flex", alighnItems: "flex-start", flexDirection: "row" }}><a href="https://cancham.org.eg/en/"><Avatar sx={{ cursor: "pointer", width: 72, height: 72 }} src={`${process.env.PUBLIC_URL}/logo192.png`} /></a><Typography fontWeight="bold" variant="h2" sx={{ color: "var(--mainWhite)" }}>{" "}CanCham | Online Learning</Typography></Box>
        <Typography variant="h3" sx={{ color: "var(--mainWhite)" }}>Welcome {auth?.user?.name || auth?.user?.username}!</Typography>
        
      </Box>
      <Typography variant="h3" sx={{ color: "var(--secColor)", mb: 5 }}>Your Actions</Typography>
      <Box sx={centered_flex_box}>
        <Button onClick={() => { navigate("/Admin/addUsers") }} sx={{ width: 200, height: 200, fontSize: 20, mr: 1, ...main_button }}><AccountCircle fontSize='large' /> Add Users</Button>
        <Button onClick={() => { navigate("/Admin/access") }} sx={{ width: 200, height: 200, fontSize: 20, mr: 1, ...main_button }}><AssuredWorkloadIcon fontSize='large' /> Add corporate access</Button>
        <Button onClick={() => { navigate("/Admin/promotions") }} sx={{ width: 200, height: 200, fontSize: 20, mr: 1, ...main_button }}><DiscountIcon fontSize='large' /> Add Promotion</Button><br/>
        <Button onClick={() => { viewRefunds({ info: { page: 1 }, token: auth?.token }); navigate("/Admin/requests") }} sx={{ width: 200, height: 200, fontSize: 20, mr: 1, ...main_button }}><PaidIcon fontSize='large' /> view Refund Requests</Button>
        <Button onClick={() => { viewRequests({ info: { page: 1 }, token: auth?.token }); navigate("/Admin/requests") }} sx={{ width: 200, height: 200, fontSize: 20, mr: 1, ...main_button }}><MenuBookIcon fontSize='large' /> view course access Requests</Button>
        <Button onClick={() => { navigate("/reports") }} sx={{ width: 200, height: 200, fontSize: 20, mr: 1, ...main_button }}><FlagCircleIcon fontSize='large' /> view Reported Problems</Button>
      </Box >
    </Container >  
  );
}

const mapStateToProps = (state) => ({
  auth: state?.auth
});

const mapDispatchToProps = { logout, viewRequests, viewRefunds };

export default connect(mapStateToProps, mapDispatchToProps)(Home);