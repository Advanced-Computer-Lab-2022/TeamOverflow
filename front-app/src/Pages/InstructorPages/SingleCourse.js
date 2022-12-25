import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Box, Card, Container, CssBaseline, Button, FormHelperText, Select, MenuItem, CircularProgress, Tooltip } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { viewCourse } from '../../app/store/actions/coursesActions';
import moment from "moment";
import { centered_flex_box, left_flex_box, main_button } from '../../app/components/Styles';
import { ActionModal } from '../../app/components';
import { closeCourse, deleteCourse, publishCourse } from '../../app/store/actions/instructorActions';

const theme = createTheme();

export const InstructorSingleCourse = ({ auth, viewCourse, course, isLoading, publishCourse, deleteCourse, closeCourse }) => {

    const courseId = useParams().id
    const navigate = useNavigate()
    const [modals, setModals] = React.useState({
        closeModal: false,
        deleteModal: false,
        publishModal: false
    })
    var {closeModal, deleteModal, publishModal} = modals

    React.useEffect(() => {
        viewCourse({ id: courseId, token: auth?.token })
    }, [])

    const handleClose = () => {
        setModals({
            closeModal: false,
            deleteModal: false,
            publishModal: false
        })
    }

    const handlePublish = (event) => {
        handleClose()
        publishCourse({info: {courseId: course?._id}, token: auth?.token})
    }

    const handleDelete = (event) => {
        handleClose()
        deleteCourse({info: {courseId: course?._id}, token: auth?.token}, navigate)
    }

    const handleCloseCourse = (event) => {
        handleClose()
        closeCourse({info: {courseId: course?._id}, token: auth?.token})
    }

    if (isLoading) {
        return (
            <Box sx={{...centered_flex_box, minHeight: "100vh"}}>
                <CircularProgress sx={{ color: "var(--secColor)" }} />
            </Box>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl">
                <CssBaseline />
                <Typography>Title: {course?.title}</Typography>
                <Typography>Subject: {course?.subject}</Typography>
                <Typography>Summary: {course?.summary}</Typography>
                <Typography>Price: {course?.price}</Typography>
                {
                    (course?.deadline && moment().isBefore(course?.deadline)) ? (
                        <>
                            <Typography>Discount: {course?.discount}%</Typography>
                            <Typography>Ends {moment(course?.deadline).fromNow()}</Typography>
                        </>
                    ) : (
                        <Typography>Discount: <NavLink to={`/course/discount/${course?._id}`}>Add a discount</NavLink></Typography>
                    )
                }
                <Typography>Total Hours: {course?.totalHours}</Typography>
                <Typography>Rating: {course?.rating}</Typography>
                <Typography>Video: {course?.videoId ? <NavLink to={`/course/video/${course?.videoId?._id}`}>View Preview Video</NavLink> : <NavLink to={`/course/video/upload/courseId=${course?._id}`}>Add Preview Video</NavLink>}</Typography>
                <Typography>Exercise: {course?.examId ? <NavLink to={`/course/exercise/view/${course?.examId}`}>View Exam</NavLink> : <NavLink to={`/course/exercise/create/courseId=${course?._id}`}>Add Exercise</NavLink>}</Typography>
                <hr />
                <Box sx={{...left_flex_box}}>
                    {course?.published && <Tooltip title="Closing the course will not allow more students to enroll"><Button onClick={() => setModals({...modals, closeModal:true})} sx={{...main_button, ml: 1}}>Close Course</Button></Tooltip>}
                    {course?.enrolled === 0 && <Button onClick={() => setModals({...modals, deleteModal:true})} sx={{...main_button, ml:1}}>Delete Course</Button>}
                    {!course?.closed && !course?.published && <Button onClick={() => setModals({...modals, publishModal:true})} sx={{...main_button, ml:1}}>Publish Course</Button>}
                    <ActionModal action={handleCloseCourse} open={closeModal} handleClose={handleClose} message="Closing the course is irreversible"/>
                    <ActionModal action={handlePublish} open={publishModal} handleClose={handleClose} message="Publishing the course will not allow you to edit any more"/>
                    <ActionModal action={handleDelete} open={deleteModal} handleClose={handleClose} message="Deleting the course is irreversible"/>
                </Box>
                <hr/>
                <Typography>Subtitles</Typography>
                <hr />
                {
                    course?.subtitles?.map((subtitle, i) => {
                        return <>
                            <Typography>Title: {subtitle?.title}</Typography>
                            <Typography>Time: {subtitle?.time}</Typography>
                            <Typography>Video: {subtitle?.videoId ? <NavLink to={`/course/video/${subtitle?.videoId}`}>View Subtitle Video</NavLink> : <NavLink to={`/course/video/upload/subId=${subtitle?._id}`}>Add Subtitle Video</NavLink>}</Typography>
                            <Typography>Exercise: {subtitle?.exerciseId ? <NavLink to={`/course/exercise/view/${subtitle?.exerciseId}`}>View Exercise</NavLink> : <NavLink to={`/course/exercise/create/subId=${subtitle?._id}`}>Add Exercise</NavLink>}</Typography>
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
    course: state?.courses?.single,
    isLoading: state?.courses?.isLoading
});

const mapDispatchToProps = { viewCourse, publishCourse, deleteCourse, closeCourse };

export default connect(mapStateToProps, mapDispatchToProps)(InstructorSingleCourse);