import * as React from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupsIcon from '@mui/icons-material/Groups';
import CloudIcon from '@mui/icons-material/Cloud';
import DiscountIcon from '@mui/icons-material/Discount';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import { Typography, Box, Card, Container, CssBaseline, Button, FormHelperText, Select, MenuItem, CircularProgress, Tooltip, Chip, Rating, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { viewCourse } from '../../app/store/actions/coursesActions';
import moment from "moment";
import { centered_flex_box, left_flex_box, main_button, right_flex_box, sec_button } from '../../app/components/Styles';
import { ActionModal, SubtitleCard } from '../../app/components';
import { closeCourse, deleteCourse, publishCourse } from '../../app/store/actions/instructorActions';
import ReactPlayer from 'react-player/youtube';
import { requestAccess } from '../../app/store/actions/corporateActions';
import { getPaymentLink } from '../../app/store/actions/traineeActions';

const theme = createTheme();

export const PreviewCourse = ({ auth, viewCourse, course, isLoading, publishCourse, deleteCourse, closeCourse }) => {

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

    const role = auth?.token?.split(" ")[0]


    const handleEnroll = (event) => {
        getPaymentLink({
            courseId: courseId,
            token: auth?.token
        })
    }

    const handleRequest = (event) => {
        requestAccess({
            courseId: courseId,
            token: auth?.token
        })
    }
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
            <Box className="course-head" sx={{ display: "flex", alighnItems: "flex-start", flexDirection: "column", mx: "-24px", mt: -2, minWidth: "100%", minHeight: "50vh", mb: 2, p: 2, px: 5 }}>
                <Grid container>
                    <Grid item xs={10}>
                        <Typography fontWeight="bold" variant="h2" sx={{ color: "var(--mainWhite)" }}>{course?.title}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Box sx={{ ...centered_flex_box, flexDirection: "column" }}>
                            {
                                (course?.deadline && course?.startDate && moment().isBefore(course?.deadline) && moment().isAfter(course?.startDate)) ? (<>
                                    <Chip sx={{ color: "green", fontSize: 27, mb: 1, bgcolor: "var(--mainWhite)", p: 2 }} label={`${course?.currency} ${(course?.price * (100 - course?.discount) / 100).toFixed(2)}`} />
                                </>) : (<>
                                    <Chip sx={{ color: "var(--secColor)", fontSize: 27, mb: 1, bgcolor: "var(--mainWhite)", p: 2 }} label={`${course?.currency} ${course?.price}`} />
                                </>)
                            }
                            {role === "Trainee" && !course?.isEnrolled && <Button onClick={handleEnroll} sx={sec_button}><ShoppingCartCheckoutIcon /> Enroll in Course</Button>}
                            {role === "Corporate" && !course?.isEnrolled && <Button onClick={handleRequest} sx={sec_button}><RequestPageIcon /> Request access</Button>}
                            {course?.isEnrolled && <Button onClick={() => navigate(`/courses/student/single/${courseId}`)} sx={sec_button}><ArrowForwardIosIcon /> Go to Course</Button>}
                        </Box>
                    </Grid>
                </Grid>
                <Typography variant="h5" sx={{ color: "var(--mainWhite)" }}>{course?.subject}</Typography>
                <Rating readOnly value={course?.rating} />
                <Typography variant="p" sx={{ color: "var(--mainWhite)" }}>{course?.numberOfRatings} Ratings</Typography>
                <Typography textAlign="justify" variant="p" fontSize={18} sx={{ color: "var(--mainWhite)", mt: 2, mb: 10, maxWidth: "90%" }}>{course?.summary}</Typography>

            </Box>
            <Grid container direction="row" mb={2}>
                <Grid item xs={8} minHeight="100%">
                    <Box sx={{ ...centered_flex_box, minHeight: "100%" }}>
                        <Box sx={{ bgcolor: "var(--secWhite)", p: 1, minHeight: "100%" }}>
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
                            (course?.deadline && course?.startDate && moment().isBefore(course?.deadline) && moment().isAfter(course?.startDate)) ? (<>
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
            <hr />
            <Grid container sx={centered_flex_box}>
                {
                    course?.subtitles?.map((subtitle, i) => {
                        return (
                            <Grid item xs={12} sx={centered_flex_box}>
                                <SubtitleCard subtitle={subtitle} key={i} />
                            </Grid>
                        )
                    })
                }
            </Grid>
        </Container >
    );
}

const mapStateToProps = (state) => ({
    auth: state?.auth,
    course: state?.courses?.single,
    isLoading: state?.courses?.isLoading
});

const mapDispatchToProps = { viewCourse, publishCourse, deleteCourse, closeCourse };

export default connect(mapStateToProps, mapDispatchToProps)(PreviewCourse);

