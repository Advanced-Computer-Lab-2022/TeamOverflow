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
import { viewCourse } from '../../app/store/actions/coursesActions';
import moment from "moment";
import { centered_flex_box, main_button } from '../../app/components/Styles';
import { getPaymentLink } from '../../app/store/actions/traineeActions';
import ReactPlayer from 'react-player'

const theme = createTheme();

export const CoursePreview = ({ auth, viewCourse, course, getPaymentLink }) => {

    const role = auth?.token?.split(" ")[0]
    const navigate = useNavigate()

    const courseId = useParams().id
    React.useEffect(() => {
        viewCourse({
            id: courseId,
            token: auth.token
        })
    }, [])

    const handleEnroll = (event) => {
        getPaymentLink({
            courseId: courseId,
            token: auth?.token
        })
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl">
                <CssBaseline />
                <Typography>Title: {course?.title}</Typography>
                <Typography>Subject: {course?.subject}</Typography>
                <Typography>Summary: {course?.summary}</Typography>
                {
                    (course?.deadline && moment().isBefore(course?.deadline)) ? (
                        <>
                            <Typography>Price: <Typography sx={{ textDecoration: "line-through" }}>{course?.currency} {course?.price}</Typography><Typography>{course?.currency} {(course?.price * ((100 - course?.discount) / 100)).toFixed(2)}</Typography></Typography><br />
                            <Typography>Discount: {course?.discount}%</Typography>
                            <Typography>Ends {moment(course?.deadline).fromNow()}</Typography>
                        </>
                    ) : (
                        <Typography>Price: {course?.price}</Typography>
                    )
                }
                <Typography>Total Hours: {course?.totalHours}</Typography>
                <Typography>Rating: {course?.rating}</Typography>
                {role === "Trainee" && <Button onClick={handleEnroll} sx={main_button}>Enroll in Course</Button>}
                {role === "Corporate" && <Button sx={main_button}>Request access to Course</Button>}
                {course?.videoId && (<>
                    <hr />
                    <Box controls={true} sx={centered_flex_box}>
                        <ReactPlayer url={course?.videoId?.url} />
                    </Box>
                </>)
                }
                <hr />
                <Typography>Subtitles</Typography>
                <hr />
                {
                    course?.subtitles?.map((subtitle, i) => {
                        return <>
                            <Typography>Title: {subtitle?.title}</Typography>
                            <Typography>Time: {subtitle?.time}</Typography>
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

const mapDispatchToProps = { viewCourse, getPaymentLink };

export default connect(mapStateToProps, mapDispatchToProps)(CoursePreview);