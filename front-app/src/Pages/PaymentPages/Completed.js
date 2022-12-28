import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Box, Container, TextField, CssBaseline, Button, Avatar, Select, MenuItem, FormHelperText, InputLabel, Card, Toolbar, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { useNavigate, Navigate, NavLink, Route, Routes, useParams } from "react-router-dom";
import { registerCourse } from '../../app/store/actions/traineeActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { centered_flex_box, main_button } from '../../app/components/Styles';

const theme = createTheme();

export const Completed = ({ token, user, registerCourse, isLoading }) => {
  const navigate = useNavigate();
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

  if (isLoading) {
    return (
        <Box sx={{ ...centered_flex_box, minHeight: "100vh" }}>
            <CircularProgress sx={{ color: "var(--secColor)" }} />
        </Box>
    )
}

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <CssBaseline />
        <Box sx={{ flexDirection: "column", ...centered_flex_box, mt:10}}>
          <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
          <Typography color={"var(--secColor)"} fontSize="30px" align="center">Payment Completed</Typography>
          <Button onClick={() => navigate(`/courses/student/single/${courseId}`)} type="submit"
            variant="contained"
            sx={{ mt: 4, ...main_button }}
          >
            Go to course </Button>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

const mapStateToProps = (state) => ({
  user: state?.auth?.user,
  token: state?.auth?.token,
  isLoading: state?.courses?.isLoading
});

const mapDispatchToProps = { registerCourse };

export default connect(mapStateToProps, mapDispatchToProps)(Completed);