import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Box, Card, Container, CssBaseline, Button, FormHelperText, Select, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { NavLink, useParams } from 'react-router-dom';
import { viewCourse } from '../../app/store/actions/coursesActions';

const theme = createTheme();

export const InstructorSingleCourse = ({ auth, viewCourse, course }) => {

    const courseId = useParams().id
    React.useEffect(() => {
        viewCourse({ id: courseId, token: auth.token })
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl">
                <CssBaseline />
                <Typography>Title: {course?.title}</Typography>
                <Typography>Subject: {course?.subject}</Typography>
                <Typography>Summary: {course?.summary}</Typography>
                <Typography>Price: {course?.price}</Typography>
                <Typography>Discount: {course?.discount}</Typography>
                <Button>Add a discount</Button>
                <Typography>Total Hours: {course?.totalHours}</Typography>
                <Typography>Rating: {course?.rating}</Typography>
                <Typography>Video: {course?.videoId ? <NavLink to={`/course/video/${course?.videoId}`}>View Preview Video</NavLink> : <Button>Add a preview Video</Button>}</Typography>
                <Typography>Exercise: {course?.exerciseId ? <NavLink to={`/course/exercise/${course?.exerciseId}`}>View Exam</NavLink> : <NavLink to={`/course/exercise/create/courseId=${course?._id}`}>Add Exercise</NavLink>}</Typography>
                <hr/>
                <Typography>Subtitles</Typography>
                <hr/>
                {
                    course?.subtitles?.map((subtitle, i) => {
                        return <>
                            <Typography>Title: {subtitle?.title}</Typography>
                            <Typography>Time: {subtitle?.time}</Typography>
                            <Typography>Video: {subtitle?.videoId ? <NavLink to={`/course/video/${subtitle?.videoId}`}>View Subtitle Video</NavLink> : <Button>Add a Subtitle Video</Button>}</Typography>
                            <Typography>Exercise: {subtitle?.exerciseId ? <NavLink to={`/course/exercise/${subtitle?.exerciseId}`}>View Exercise</NavLink> : <NavLink to={`/course/exercise/create/subId=${subtitle?._id}`}>Add Exercise</NavLink>}</Typography>
                            <hr/>
                        </>
                    })
                }
            </Container>
        </ThemeProvider>
    );
}

const mapStateToProps = (state) => ({
    auth: state?.auth,
    course: state?.courses?.single
});

const mapDispatchToProps = { viewCourse };

export default connect(mapStateToProps, mapDispatchToProps)(InstructorSingleCourse);