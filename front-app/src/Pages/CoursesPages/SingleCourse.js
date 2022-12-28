import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Box, Card, Container, CssBaseline, Button, FormHelperText, Select, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { openCourse } from '../../app/store/actions/coursesActions';
import moment from "moment";

const theme = createTheme();

export const TraineeSingleCourse = ({ auth, openCourse, course }) => {

    const courseId = useParams().id
    const navigate = useNavigate()

    React.useEffect(() => {
        openCourse({
            query: {
                courseId: courseId
            },
            token: auth.token
        }, navigate)
    }, [])

    const examsSolved = course?.examSolutions.map((sol) => sol.exerciseId)

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl">
                <CssBaseline />
                <Typography>Title: {course?.course?.title}</Typography>
                <Typography>Subject: {course?.course?.subject}</Typography>
                <Typography>Summary: {course?.course?.summary}</Typography>
                <Typography>Price: {course?.course?.price}</Typography>
                {
                    (course?.course?.deadline && moment().isBefore(course?.course?.deadline)) ? (
                        <>
                            <Typography>Discount: {course?.course?.discount}%</Typography>
                            <Typography>Ends {moment(course?.course?.deadline).fromNow()}</Typography>
                        </>
                    ) : (
                        <></>
                    )
                }
                <Typography>Total Hours: {course?.course?.totalHours}</Typography>
                <Typography>Rating: {course?.course?.rating}</Typography>
                <NavLink to={`/Rate/courseId=${course?.course?._id}`}>Rate Course</NavLink>
                <Typography>Video: {course?.course?.videoId ? <NavLink to={`/course/watch/${course?.course?._id}/${course?.course?.videoId._id}`}>View Preview Video</NavLink> : "No Preview Video"}</Typography>
                <Typography>Exercise: {course?.course?.examId ? (examsSolved.includes(course?.course?.examId?._id) ? <NavLink to={`/course/grade/${course?.examSolutions[examsSolved.indexOf(course?.course?.examId?._id)]._id}`}>Get Grade</NavLink> : <NavLink to={`/course/solve/exercise/${course?.course?._id}/${course?.course?.examId?._id}`}>Solve Exam</NavLink>) : "No Course Exam"}</Typography>
                <hr />
                <Typography>Subtitles</Typography>
                <hr />
                {
                    course?.subtitles?.map((subtitle, i) => {
                        return <>
                            <Typography>Title: {subtitle?.title}</Typography>
                            <Typography>Time: {subtitle?.time}</Typography>
                            <Typography>Video: {subtitle?.videoId ? <NavLink to={`/course/watch/${course?.course?._id}/${subtitle?.videoId._id}`}>View Subtitle Video</NavLink> : "No Video"}</Typography>
                            <Typography>Exercise: {subtitle?.exerciseId ? (examsSolved.includes(subtitle?.exerciseId._id) ? <NavLink to={`/course/grade/${course?.examSolutions[examsSolved.indexOf(subtitle?.exerciseId._id)]._id}`}>Get Grade</NavLink> : <NavLink to={`/course/solve/exercise/${course?.course?._id}/${subtitle?.exerciseId._id}`}>Solve Exercise</NavLink>) : "No Exercise"}</Typography>
                            <hr />
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

const mapDispatchToProps = { openCourse };

export default connect(mapStateToProps, mapDispatchToProps)(TraineeSingleCourse);