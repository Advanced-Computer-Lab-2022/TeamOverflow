import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Box, Container, TextField, CssBaseline, Button, Avatar, Select, MenuItem, FormHelperText, InputLabel , Card, Toolbar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { useNavigate , Navigate, NavLink, Route, Routes, useParams } from "react-router-dom";
import { registerCourse } from '../../app/store/actions/traineeActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const theme = createTheme();

export const Completed = ({ token, user, registerCourse }) => {
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

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <CssBaseline />
       <Box display={"flex"} align='left' sx={{flexDirection:"column" ,mt:5, maxWidth:250, ml: 60}}>
           <Box color={"var(--secColor)"} >
             <CheckCircleIcon color="success"  sx={{ fontSize: 60 , mt: 12, ml: 12}} />
               <Typography  color={"var(--secColor)"} fontSize="30px"  align="center">Payment Completed</Typography> 
               <Button onClick={() => navigate (`/courses/student/single/${courseId}`) } type="submit" 
                 variant="contained"
                  sx={{ mt: 4, ml: 6.5, backgroundColor: "var(--secColor)" }}
           >
            go to course </Button>
         </Box>
        </Box>        
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