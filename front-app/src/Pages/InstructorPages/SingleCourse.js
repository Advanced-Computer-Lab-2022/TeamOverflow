import * as React from 'react';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PercentIcon from '@mui/icons-material/Percent';
import QuizIcon from '@mui/icons-material/Quiz';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupsIcon from '@mui/icons-material/Groups';
import CloudIcon from '@mui/icons-material/Cloud';
import DiscountIcon from '@mui/icons-material/Discount';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import { Typography, Box, Card, Container, CssBaseline, Button, FormHelperText, Select, MenuItem, CircularProgress, Tooltip, Chip, Rating, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { viewCourse } from '../../app/store/actions/coursesActions';
import moment from "moment";
import { centered_flex_box, left_flex_box, main_button, right_flex_box } from '../../app/components/Styles';
import { ActionModal, SubtitleCard } from '../../app/components';
import { closeCourse, deleteCourse, publishCourse } from '../../app/store/actions/instructorActions';
import ReactPlayer from 'react-player/youtube';

const theme = createTheme();

export const InstructorSingleCourse = ({ auth, viewCourse, course, isLoading, publishCourse, deleteCourse, closeCourse }) => {

    const courseId = useParams().id
    const navigate = useNavigate()
    const [modals, setModals] = React.useState({
        closeModal: false,
        deleteModal: false,
        publishModal: false
    })
    var { closeModal, deleteModal, publishModal } = modals

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
        publishCourse({ info: { courseId: course?._id }, token: auth?.token })
    }

    const handleDelete = (event) => {
        handleClose()
        deleteCourse({ info: { courseId: course?._id }, token: auth?.token }, navigate)
    }

    const handleCloseCourse = (event) => {
        handleClose()
        closeCourse({ info: { courseId: course?._id }, token: auth?.token })
    }

    if (isLoading) {
        return (
            <Box sx={{ ...centered_flex_box, minHeight: "100vh" }}>
                <CircularProgress sx={{ color: "var(--secColor)" }} />
            </Box>
        )
    }

    return (
        <Container component="main" maxWidth="xl">
            <Box className="course-head" sx={{ display: "flex", alighnItems: "flex-start", flexDirection: "column", mx: "-24px", mt: -2, minWidth: "100%", minHeight: "50vh", mb: 2, p: 2 }}>
                <Typography fontWeight="bold" variant="h2" sx={{ color: "var(--mainWhite)" }}>{course?.title}</Typography>
                <Typography variant="h5" sx={{ color: "var(--mainWhite)" }}>{course?.subject}</Typography>
                <Rating readOnly value={course?.rating} />
                <Typography variant="p" sx={{ color: "var(--mainWhite)" }}>{course?.numberOfRatings} Ratings</Typography>
                <Typography textAlign="justify" variant="p" fontSize={18} sx={{ color: "var(--mainWhite)", mt: 2, mb: 10, maxWidth: "90%" }}>{course?.summary}</Typography>
            </Box>
            <Grid container direction="row" mb={2}>
                <Grid item xs={8} minHeight="100%">
                    <Box sx={{ ...centered_flex_box, minHeight:"100%" }}>
                        <Box sx={{ bgcolor: "var(--secWhite)", p: 1, minHeight:"100%" }}>
                            {course?.videoId ? <ReactPlayer controls={true} url={course?.videoId?.url} /> : <Button onClick={() => navigate(`/course/video/upload/courseId=${course?._id}`)} sx={{ ...main_button }}><OndemandVideoIcon /> Add Course Preview</Button>}
                        </Box>
                    </Box>
                </Grid>
                <Grid sx={{ bgcolor: "var(--secWhite)", p: 2 }} item xs={4}>
                    <Grid container justifyContent="space-evenly" direction="column" sx={{ minHeight: "100%" }}>
                        <Grid item><Typography fontSize={27} ><GroupsIcon fontSize='large' />   {course?.enrolled} Students</Typography></Grid>
                        <Grid item><Typography fontSize={27} ><AccessTimeIcon fontSize='large' />   {course?.totalHours} Hours of content</Typography></Grid>
                        <Grid item><Typography fontSize={27} ><CloudIcon fontSize='large' />   {course?.published ? "Published" : "Unpublished"} course</Typography></Grid>
                        {
                            (course?.deadline && moment().isBefore(course?.deadline)) ? (<>
                                <Grid item><Typography fontSize={27} ><AttachMoneyIcon fontSize='large' />   {course?.currency} {(course?.price * (100 - course?.discount) / 100).toFixed(2)}</Typography></Grid>
                                <Grid item><Typography fontSize={27} ><DiscountIcon fontSize='large' />   {course?.discount}% off</Typography></Grid>
                                <Grid item><Typography fontSize={27} ><AlarmOffIcon fontSize='large' />   Discount ends {moment(course?.deadline).fromNow()}</Typography></Grid>
                            </>) : (<>
                                <Grid item><Typography fontSize={27} ><AttachMoneyIcon fontSize='large' />   {course?.currency} {course?.price}</Typography></Grid>
                                <Grid item><Typography fontSize={27} ><DiscountIcon fontSize='large' />   No discount</Typography></Grid>
                            </>)
                        }
                    </Grid>
                </Grid>
            </Grid>

            <Box className="course-info" sx={{ ...centered_flex_box, justifyContent: "flex-start", flexDirection: "column", mx: "-24px", minWidth: "100%", minHeight: "20vh" }}>
                <Box sx={{ ...centered_flex_box, flexDirection: "column", mt: 2 }}>
                    <Typography variant="h4" sx={{ color: "black", mb: 2 }}>Course Actions</Typography>
                    <Box sx={{ ...centered_flex_box, mb: 2 }}>
                        {course?.published && <Tooltip title="Closing the course will not allow more students to enroll"><Button onClick={() => setModals({ ...modals, closeModal: true })} sx={{ ...main_button, ml: 1 }}><UnpublishedIcon /> Close Course</Button></Tooltip>}
                        {course?.enrolled === 0 && <Button onClick={() => setModals({ ...modals, deleteModal: true })} sx={{ ...main_button, ml: 1 }}><DeleteForeverIcon /> Delete Course</Button>}
                        {!course?.closed && !course?.published && <Button onClick={() => setModals({ ...modals, publishModal: true })} sx={{ ...main_button, ml: 1 }}><PublishIcon /> Publish Course</Button>}
                        <ActionModal action={handleCloseCourse} open={closeModal} handleClose={handleClose} message="Closing the course is irreversible" />
                        <ActionModal action={handlePublish} open={publishModal} handleClose={handleClose} message="Publishing the course will not allow you to edit any more" />
                        <ActionModal action={handleDelete} open={deleteModal} handleClose={handleClose} message="Deleting the course is irreversible" />
                        {course?.examId ? <Button onClick={() => navigate(`/course/exercise/view/${course?.examId}`)} sx={{ ...main_button, ml: 1 }}><QuizIcon /> View Final Exam</Button> : <Button onClick={() => navigate(`/course/exercise/create/courseId=${course?._id}`)} sx={{ ...main_button, ml: 1 }}><QuizIcon /> Add Final Exam</Button>}
                        {!course?.videoId && <Button onClick={() => navigate(`/course/video/upload/courseId=${course?._id}`)} sx={{ ...main_button, ml: 1 }}><OndemandVideoIcon /> Add Course Preview</Button>}
                        <Button onClick={() => navigate(`/course/discount/${courseId}`)} sx={{ ...main_button, ml: 1 }}><PercentIcon /> Add Discount</Button>
                    </Box>

                </Box>
            </Box>
            <hr />
            {
                course?.subtitles?.map((subtitle, i) => {
                    return <SubtitleCard subtitle={subtitle} key={i} />
                })
            }
        </Container >
    );
}

const mapStateToProps = (state) => ({
    auth: state?.auth,
    course: state?.courses?.single,
    isLoading: state?.courses?.isLoading
});

const mapDispatchToProps = { viewCourse, publishCourse, deleteCourse, closeCourse };

export default connect(mapStateToProps, mapDispatchToProps)(InstructorSingleCourse);