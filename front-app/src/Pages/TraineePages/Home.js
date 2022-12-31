import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Box, Container, CssBaseline, Button, FormHelperText, Select, MenuItem, Rating, CircularProgress, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../app/store/actions/authActions';
import countryList from 'country-json/src/country-by-name.json'
import { selectCountry } from '../../app/store/actions/instructorActions';
import { getCoursesRatings, getInstructorRatings } from '../../app/store/actions/ratingActions';
import { getPopularCourses, getRegisteredCourses } from '../../app/store/actions/coursesActions';
import { CourseCard, InstructorCourseCard, RegisteredCourseCard } from '../../app/components';
import Inbox from '@mui/icons-material/Inbox';
import { centered_flex_box, main_button, right_flex_box } from '../../app/components/Styles';

const theme = createTheme();
export const Home = ({ auth, logout, getRegisteredCourses, courses, getPopularCourses }) => {

  const navigate = useNavigate()

  React.useEffect(() => {
    getRegisteredCourses({ page: 1, token: auth?.token })
    getPopularCourses(auth?.token)
  }, [])

  return (
    <Container component="main" maxWidth="xl">
      <Box className="course-head" sx={{ display: "flex", alighnItems: "flex-start", flexDirection: "column", mx: "-24px", mt: -2, minWidth: "100%", minHeight: "35vh", mb: 2, p: 2 }}>
        <Box sx={{ display: "flex", alighnItems: "flex-start", flexDirection: "row" }}><a href="https://cancham.org.eg/en/"><Avatar sx={{ cursor: "pointer", width: 72, height: 72 }} src={`${process.env.PUBLIC_URL}/logo192.png`} /></a><Typography fontWeight="bold" variant="h2" sx={{ color: "var(--mainWhite)" }}>{" "}CanCham | Online Learning</Typography></Box>
        <Typography variant="h3" sx={{ color: "var(--mainWhite)" }}>Welcome {auth?.user?.name || auth?.user?.username}!</Typography>
        <Typography variant="h5" sx={{ color: "var(--mainWhite)" }}>{auth?.user?.country}{auth?.user?.corporation ? ` | ${auth?.user?.corporation}`:""}</Typography>
      </Box>

      <Typography variant="h3" sx={{ color: "var(--secColor)", mb:1 }}>Most popular courses</Typography>
      <Box sx={right_flex_box}>
        <Button onClick={() => {navigate("/courses")}} sx={{ mr: 1, ...main_button }}><AutoStoriesIcon/> View All Courses</Button>
      </Box>
      <hr/>
      {!courses?.isLoading ? (
        <Grid container spacing={3} sx={centered_flex_box}>
          {courses?.popular?.map((course, i) => {
            return (
              <Grid item xs={5}>
                <CourseCard course={course} rank={i+1} key={i} />
              </Grid>
            )
          })}
          {courses?.popular?.length === 0 && (
            <Grid item sx={{ ...centered_flex_box, flexDirection: "column", mt: 2 }}>
              <Inbox fontSize="large" />
              <Typography fontSize={40}>No results</Typography>
            </Grid>
          )}
        </Grid>
      ) : (
        <Box sx={centered_flex_box}>
          <CircularProgress sx={{ color: "var(--secColor)" }} />
        </Box>
      )}
      
      <Typography variant="h3" sx={{ color: "var(--secColor)", mb:1 }}>Your courses</Typography>
      <Box sx={right_flex_box}>
        <Button onClick={() => {navigate("/courses/student")}} sx={{ mr: 1, ...main_button }}><AutoStoriesIcon/> See All My Courses</Button>
      </Box>
      <hr/>
      {!courses?.isLoading ? (
        <Grid container spacing={3} sx={centered_flex_box}>
          {courses?.results?.docs?.map((course) => {
            return (
              <Grid item xs={5}>
                <RegisteredCourseCard courseData={course} />
              </Grid>
            )
          })}
          {courses?.results?.docs?.length === 0 && (
            <Grid item sx={{ ...centered_flex_box, flexDirection: "column", mt: 2 }}>
              <Inbox fontSize="large" />
              <Typography fontSize={40}>No results</Typography>
            </Grid>
          )}
        </Grid>
      ) : (
        <Box sx={centered_flex_box}>
          <CircularProgress sx={{ color: "var(--secColor)" }} />
        </Box>
      )}
    </Container>
  );
}

const mapStateToProps = (state) => ({
  auth: state?.auth,
  courses: state?.courses
});

const mapDispatchToProps = {
  getRegisteredCourses,
  getPopularCourses
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);