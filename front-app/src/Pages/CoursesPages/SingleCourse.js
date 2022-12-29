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
import { openCourse, viewCourse } from '../../app/store/actions/coursesActions';
import moment from "moment";
import { centered_flex_box, left_flex_box, main_button, right_flex_box, sec_button } from '../../app/components/Styles';
import { ActionModal, RatingModal, SubCard } from '../../app/components';
import ReactPlayer from 'react-player/youtube';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { postRating } from '../../app/store/actions/ratingActions';

const theme = createTheme();

export const SingleCourse = ({ auth, openCourse, course, isLoading, examSolutions, subtitles, postRating }) => {

    const courseId = useParams().id
    const navigate = useNavigate()
    const [modals, setModals] = React.useState({
        courseRatingModal: false,
        instructorRatingModal: false,
    })
    var { courseRatingModal, instructorRatingModal } = modals;

    const examsSolved = examSolutions?.map((sol) => sol.exerciseId)

    React.useEffect(() => {
        openCourse({ query: { courseId: courseId }, token: auth?.token })
    }, [])

    const role = auth?.token?.split(" ")[0]

    const handleClose = () => {
        setModals({
            courseRatingModal: false,
            instructorRatingModal: false
        })
    }

    const handleSubmit = (event, message, id) => {
        event.preventDefault();
        handleClose();
        const data = new FormData(event.currentTarget);
        var details = {
            creation: {
                rating: parseInt(event.nativeEvent.target.attributes.value.value),
                review: data.get('review'),
                instructorId: message === "Instructor" ? id : undefined,
                courseId: message === "Course" ? id : undefined
            },
            token: auth.token
        }
        postRating(details)
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
                <Grid container>
                    <Grid item xs={8} flexDirection="column">
                        <Typography fontWeight="bold" variant="h2" sx={{ color: "var(--mainWhite)" }}>{course?.title}</Typography>
                        <Typography variant="h5" sx={{ color: "var(--mainWhite)" }}>{course?.subject}</Typography>
                        <Box><Rating readOnly value={course?.rating} /></Box>
                        <Box><Typography variant="p" sx={{ color: "var(--mainWhite)" }}>{course?.numberOfRatings} Ratings</Typography></Box>
                        <Box sx={{ mb: 10 }}><Typography textAlign="justify" variant="p" fontSize={18} sx={{ color: "var(--mainWhite)", mt: 2 }}>{course?.summary}</Typography></Box>
                    </Grid>
                    <Grid item xs={4} sx={{ height: "30%", ...centered_flex_box }}>
                        <Grid container justifyContent="space-evenly" direction="column" sx={{ minHeight: "100%", width: "60%" }}>
                            {course?.videoId && <Button onClick={() => navigate(`/course/watch/${course?._id}/${course?.videoId._id}`)} sx={{ ...sec_button, mt: 2, mr: 2 }}>
                                <VisibilityIcon /> Watch Preview Video
                            </Button>
                            }
                            {
                                course?.examId ? (examsSolved.includes(course?.examId._id) ? (
                                    <Button onClick={() => navigate(`/course/grade/${examSolutions[examsSolved.indexOf(course?.examId._id)]._id}`)} sx={{ ...sec_button, mt: 2, mr: 2 }}>
                                        <VisibilityIcon /> View Grade
                                    </Button>
                                ) : (
                                    <Button onClick={() => navigate(`/course/solve/exercise/${course?._id}/${course?.examId._id}`)} sx={{ ...sec_button, mt: 2, mr: 2 }}>
                                        <QuizIcon /> Solve Exercise
                                    </Button>
                                )
                                ) : (
                                    <></>
                                )
                            }
                            <Button onClick={() => setModals({ ...modals, courseRatingModal: true })} sx={{ ...sec_button, mt: 2, mr: 2 }}>
                                <QuizIcon /> Rate Course
                            </Button>
                            <RatingModal message="Course" open={courseRatingModal} handleClose={handleClose} action={(event) => handleSubmit(event, "Course", course?._id)} />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Grid container direction="row" mb={2}>
                <Grid item xs={8} minHeight="100%">
                    <Box sx={{ ...centered_flex_box, minHeight: "100%" }}>
                        <Box sx={{ bgcolor: "var(--secWhite)", p: 1, minHeight: "100%" }}>
                            {course?.videoId ? <ReactPlayer controls={true} url={course?.videoId?.url} /> : <Button onClick={() => navigate(`/course/video/upload/courseId=${course?._id}`)} sx={{ ...main_button }}><OndemandVideoIcon /> Add Course Preview</Button>}
                        </Box>
                    </Box>
                </Grid>
                <Grid sx={{ bgcolor: "var(--secWhite)", p: 2, ...centered_flex_box }} item xs={4}>
                    <Grid container justifyContent="space-between" direction="column" sx={{ minHeight: "100%" }}>
                        <Box>
                            <Typography fontWeight="bold" variant="h4" sx={{ color: "var(--secColor)" }}>Your Instructor</Typography>
                            <Typography variant="h3" sx={{ color: "var(--secColor)" }}>{course?.instructorId?.name}</Typography>
                            <Typography variant="h5" fontStyle="italic" sx={{ color: "var(--secColor)", mb: 1 }}><a target="_blank" rel="noopener noreferrer" href={`mailto:${course?.instructorId?.email}`}>{course?.instructorId?.email}</a></Typography>
                            <Typography variant="p" sx={{ color: "var(--secColor)", mb: 2 }}>{course?.instructorId?.bio}</Typography>
                        </Box>
                        <Box sx={centered_flex_box}>
                            <Button onClick={() => setModals({ ...modals, instructorRatingModal: true })} sx={{ ...main_button, mt: 2, mr: 2 }}>
                                <QuizIcon /> Rate Instructor
                            </Button>
                            <RatingModal message="Instructor" open={instructorRatingModal} handleClose={handleClose} action={(event) => handleSubmit(event, "Instructor", course?.instructorId?._id)} />
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            <hr />
            <Grid container sx={centered_flex_box}>
                {
                    subtitles?.map((subtitle, i) => {
                        return (
                            <Grid item xs={12} sx={centered_flex_box}>
                                <SubCard subtitle={subtitle} course={course} examsSolved={examsSolved} examSolutions={examSolutions} key={i} />
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
    course: state?.courses?.single?.course,
    subtitles: state?.courses?.single?.subtitles,
    examSolutions: state?.courses?.single?.examSolutions,
    isLoading: state?.courses?.isLoading
});

const mapDispatchToProps = { openCourse, postRating };

export default connect(mapStateToProps, mapDispatchToProps)(SingleCourse);