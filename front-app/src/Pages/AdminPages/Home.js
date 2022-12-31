import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Box, Container, CssBaseline, Button, FormHelperText, Select, MenuItem, Rating, CircularProgress, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { NavLink ,useNavigate} from 'react-router-dom';
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

const theme = createTheme();

export const Home = ({auth, logout}) => {
  
  const navigate = useNavigate()
  

  return (
    <Container component="main" maxWidth="xl">
      <Box className="course-head" sx={{ display: "flex", alighnItems: "flex-start", flexDirection: "column", mx: "-24px", mt: -2, minWidth: "100%", minHeight: "35vh", mb: 2, p: 2 }}>
        <Box sx={{ display: "flex", alighnItems: "flex-start", flexDirection: "row" }}><a href="https://cancham.org.eg/en/"><Avatar sx={{ cursor: "pointer", width: 72, height: 72 }} src={`${process.env.PUBLIC_URL}/logo192.png`} /></a><Typography fontWeight="bold" variant="h2" sx={{ color: "var(--mainWhite)" }}>{" "}CanCham | Online Learning</Typography></Box>
        <Typography variant="h3" sx={{ color: "var(--mainWhite)" }}>Welcome {auth?.user?.name || auth?.user?.username}!</Typography>
        
      </Box>
      <Typography variant="h3" sx={{ color: "var(--secColor)", mb: 5 }}>Your Actions</Typography>
      <Box sx={right_flex_box}>
        <Button onClick={() => { navigate("/Admin/addUsers") }} sx={{ mr: 1, ...main_button }}><AutoStoriesIcon /> Add Users</Button>
        <Button onClick={() => { navigate("/Admin/requests") }} sx={{ mr: 1, ...main_button }}><PaidIcon /> Go To Refund Requests</Button>
        <Button onClick={() => { navigate("/Admin/access") }} sx={{ mr: 1, ...main_button }}><AssuredWorkloadIcon /> Access requests</Button>
        <Button onClick={() => { navigate("/Admin/promotions") }} sx={{ mr: 1, ...main_button }}><DiscountIcon /> Add Promotion</Button>
        <Button onClick={() => { navigate("/Admin/requests") }} sx={{ mr: 1, ...main_button }}><MenuBookIcon /> Go To Requests</Button>
        <Button onClick={() => { navigate("/reports") }} sx={{ mr: 1, ...main_button }}><FlagCircleIcon /> Go To Reported Problem</Button>
      </Box>
    </Container>  
  );
}

const mapStateToProps = (state) => ({
    auth: state?.auth
});

const mapDispatchToProps = {logout};

export default connect(mapStateToProps, mapDispatchToProps)(Home);