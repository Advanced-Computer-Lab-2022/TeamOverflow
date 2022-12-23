import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Box, Container, TextField, CssBaseline, Button, Avatar, Select, MenuItem, FormHelperText, InputLabel } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { Navigate, NavLink, Route, Routes, useParams } from "react-router-dom";
import { registerCourse } from '../../app/store/actions/traineeActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const theme = createTheme();

export const Completed = ({ token, user, registerCourse }) => {

  const { session_id, courseId } = useParams()

  React.useEffect(() => {
    registerCourse({
      courseData: {
        courseId: courseId,
        session_id: session_id
      },
      token: token
    });
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <CssBaseline />
        <Typography>Payment Completed</Typography>
        <CheckCircleIcon sx={{ color: "green" }} />

        <NavLink to={`/courses/student/single/${courseId}`}>Open Course</NavLink>
      </Container>
    </ThemeProvider>
  )
}

const mapStateToProps = (state) => ({
  user: state?.auth?.user,
  token: state?.auth?.token
});

const mapDispatchToProps = { registerCourse };

export default connect(mapStateToProps, mapDispatchToProps)(Completed);