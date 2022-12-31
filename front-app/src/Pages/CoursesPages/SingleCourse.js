import * as React from 'react';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import QuizIcon from '@mui/icons-material/Quiz';
import SchoolIcon from '@mui/icons-material/School';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import { Typography, Box, Card, Container, CssBaseline, Button, FormHelperText, Select, MenuItem, CircularProgress, Tooltip, Chip, Rating, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { downloadCertificate, openCourse, viewCourse } from '../../app/store/actions/coursesActions';
import moment from "moment";
import { centered_flex_box, left_flex_box, main_button, right_flex_box, sec_button } from '../../app/components/Styles';
import { ActionModal, RatingModal, SubCard, ReportModal } from '../../app/components';
import ReactPlayer from 'react-player/youtube';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { postRating } from '../../app/store/actions/ratingActions';
import Stars from '@mui/icons-material/Stars';
import { requestRefund } from '../../app/store/actions/traineeActions';

const theme = createTheme();

export const SingleCourse = ({ auth, openCourse, course, isLoading, examSolutions, subtitles, postRating, requestRefund, downloadCertificate }) => {

    const courseId = useParams().id
    const navigate = useNavigate()
    const [modals, setModals] = React.useState({
        courseRatingModal: false,
        instructorRatingModal: false,
        reportModal: false,
        refundModal: false
    })
    var { courseRatingModal, instructorRatingModal, reportModal, refundModal } = modals;

    const examsSolved = examSolutions?.map((sol) => sol.exerciseId)

    React.useEffect(() => {
        openCourse({ query: { courseId: courseId }, token: auth?.token })
    }, [])

    const role = auth?.token?.split(" ")[0]

    const handleClose = () => {
        setModals({
            courseRatingModal: false,
            instructorRatingModal: false,
            reportModal: false,
            refundModal: false
        })
    }

    const handleRefund = (event) => {
        requestRefund({
            courseData: {
                courseId: course?._id
            },
            token: auth?.token
        }, navigate)
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
                            {course?.videoId &&
                                <Button onClick={() => navigate(`/course/watch/${course?._id}/${course?.videoId._id}`)} sx={{ ...sec_button, mt: 2, mr: 2 }}>
                                    <OndemandVideoIcon /> Watch Preview Video
                                </Button>
                            }
                            {
                                course?.examId ? (examsSolved.includes(course?.examId._id) ? (
                                    <Button onClick={() => navigate(`/course/grade/${examSolutions[examsSolved.indexOf(course?.examId._id)]?._id}`)} sx={{ ...sec_button, mt: 2, mr: 2 }}>
                                        <VisibilityIcon /> View Exam Grade
                                    </Button>
                                ) : (
                                    <Button onClick={() => navigate(`/course/solve/exercise/${course?._id}/${course?.examId._id}`)} sx={{ ...sec_button, mt: 2, mr: 2 }}>
                                        <QuizIcon /> Solve Final Exam
                                    </Button>
                                )
                                ) : (
                                    <></>
                                )
                            }
                            {parseInt(course?.progress) === 100 &&
                                <Button onClick={() => downloadCertificate({courseId: course?._id, token: auth?.token})} sx={{ ...sec_button, mt: 2, mr: 2 }}>
                                    <SchoolIcon /> Receive Certificate
                                </Button>
                            }
                            <Button onClick={() => setModals({ ...modals, courseRatingModal: true })} sx={{ ...sec_button, mt: 2, mr: 2 }}>
                                <Stars /> Rate Course
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
                            {course?.videoId ? <ReactPlayer controls={true} url={course?.videoId?.url} /> : <ReactPlayer controls={false} url="https://youtu.be/NpEaa2P7qZI" />}
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
                                <Stars /> Rate Instructor
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
            <Box className="course-info" sx={{ display: "flex", justifyContent: "flex-end", flexDirection: "row", mx: "-24px", minWidth: "100%", p: 2 }}>
                <Button onClick={() => setModals({ ...modals, reportModal: true })} sx={main_button}>
                    <ReportProblemIcon /> Report problem
                </Button>
                <ReportModal open={reportModal} courseId={course?.courseId} handleClose={handleClose} />
                {role === "Trainee" && parseInt(course?.progress) < 50 && <>
                    <Button onClick={() => setModals({ ...modals, refundModal: true })} sx={{ mx: 1, ...main_button }}>
                        <MoneyOffIcon /> Request a refund
                    </Button>
                    <ActionModal message="Requesting a refund will no longer allow you access to this course" action={handleRefund} open={refundModal} handleClose={() => setModals({ ...modals, refundModal: false })} />
                </>}
            </Box>
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

const mapDispatchToProps = { openCourse, postRating, requestRefund, downloadCertificate };

export default connect(mapStateToProps, mapDispatchToProps)(SingleCourse);