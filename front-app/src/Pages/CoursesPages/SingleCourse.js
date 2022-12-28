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
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import { Typography, Box, Card, Container, CssBaseline, Button, FormHelperText, Select, MenuItem, CircularProgress, Tooltip, Chip, Rating, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { viewCourse } from '../../app/store/actions/coursesActions';
import moment from "moment";
import { centered_flex_box, left_flex_box, main_button, right_flex_box, sec_button } from '../../app/components/Styles';
import { ActionModal, SubCard } from '../../app/components';
import { closeCourse, deleteCourse, publishCourse } from '../../app/store/actions/instructorActions';
import ReactPlayer from 'react-player/youtube';
import { requestAccess } from '../../app/store/actions/corporateActions';
import { getPaymentLink } from '../../app/store/actions/traineeActions';
import SubCard from '../../app/components/SubCard';

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
            <Box className="course-head" sx={{ display: "flex", alighnItems: "flex-start", flexDirection: "column", mx: "-24px", mt: -2, minWidth: "100%", minHeight: "50vh", mb: 2, p: 2 }}>
                <Typography fontWeight="bold" variant="h2" sx={{ color: "var(--mainWhite)" }}>{course?.title}</Typography>
                <Typography variant="h5" sx={{ color: "var(--mainWhite)" }}>{course?.subject}</Typography>
                <Rating readOnly value={course?.rating} />
                <Typography variant="p" sx={{ color: "var(--mainWhite)" }}>{course?.numberOfRatings} Ratings</Typography>
                <Typography textAlign="justify" variant="p" fontSize={18} sx={{ color: "var(--mainWhite)", mt: 2, mb: 10, maxWidth: "90%" }}>{course?.summary}</Typography>
                <Box sx={{...centered_flex_box, mb:2}}>
                {role === "Trainee" && <Button onClick={handleEnroll} sx={sec_button}><ShoppingCartCheckoutIcon/> Enroll in Course</Button>}
                {role === "Corporate" && <Button onClick={handleRequest} sx={sec_button}><RequestPageIcon/> Request access to Course</Button>}
                </Box>
                
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
                    <NavLink to={`/Rate/courseId=${course?.course?._id}`}>Rate Course</NavLink>
                    <Typography>Exercise: {course?.course?.examId ? (examsSolved.includes(course?.course?.examId?._id) ? <NavLink to={`/course/grade/${course?.examSolutions[examsSolved.indexOf(course?.course?.examId?._id)]._id}`}>Get Grade</NavLink> : <NavLink to={`/course/solve/exercise/${course?.course?._id}/${course?.course?.examId?._id}`}>Solve Exam</NavLink>) : "No Course Exam"}</Typography>
 
                    </Grid>
                </Grid>
            </Grid>
            <hr />
            <Grid container>
            {
                course?.subtitles?.map((subtitle, i) => {
                    return <SubCard subtitle={subtitle} key={i} />
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



// //This page
//   <NavLink to={`/Rate/courseId=${course?.course?._id}`}>Rate Course</NavLink>
//   <Typography>Exercise: {course?.course?.examId ? (examsSolved.includes(course?.course?.examId?._id) ? <NavLink to={`/course/grade/${course?.examSolutions[examsSolved.indexOf(course?.course?.examId?._id)]._id}`}>Get Grade</NavLink> : <NavLink to={`/course/solve/exercise/${course?.course?._id}/${course?.course?.examId?._id}`}>Solve Exam</NavLink>) : "No Course Exam"}</Typography>
