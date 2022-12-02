import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Rating, Card, Container, CssBaseline, Button, FormHelperText, Select, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { NavLink, useParams } from 'react-router-dom';
import moment from "moment";

const theme = createTheme();

export const InstructorProfile = ({ user }) => {

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl">
                <CssBaseline />
                <Typography>Name: {user?.name}</Typography>
                <Typography>Username: {user?.username}</Typography>
                <Typography>Email: {user?.email}</Typography>
                <Typography>Biography: {user?.bio}</Typography>
                <NavLink to="/Instructor/edit">Update Bio/Email</NavLink>
                <Typography>Rating:
                    <Rating
                        fullWidth
                        value={user?.rating}
                        readOnly
                    /></Typography>
            </Container>
        </ThemeProvider>
    );
}

const mapStateToProps = (state) => ({
    user: state?.auth?.user,
    course: state?.courses?.single
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(InstructorProfile);