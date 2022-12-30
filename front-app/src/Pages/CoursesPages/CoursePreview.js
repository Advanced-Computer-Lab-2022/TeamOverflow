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
import { ActionModal, SubtitleCard, WalletModal } from '../../app/components';
import { closeCourse, deleteCourse, publishCourse } from '../../app/store/actions/instructorActions';
import ReactPlayer from 'react-player/youtube';
import { requestAccess } from '../../app/store/actions/corporateActions';
import { getPaymentLink } from '../../app/store/actions/traineeActions';
import { getWallet } from '../../app/store/actions/authActions';
import School from '@mui/icons-material/School';
import Stars from '@mui/icons-material/Stars';
import { notification } from 'antd';

const theme = createTheme();

export const PreviewCourse = ({ auth, viewCourse, course, isLoading, getWallet, getPaymentLink, requestAccess }) => {

    const courseId = useParams().id
    const navigate = useNavigate()
    const role = auth?.token?.split(" ")[0]
    const [walletOpen, setWalletOpen] = React.useState(false)

    React.useEffect(() => {
        viewCourse({ id: courseId, token: auth?.token })
    }, [])

    const handleEnroll = (event) => {
        setWalletOpen(false)
        notification.info({message: "Redirecting to payment gateway..."})
        getPaymentLink({
            courseId: courseId,
            fromWallet: event.target.value,
            token: auth?.token
        })
    }

    const handleOpenWallet = (event) => {
        getWallet(auth?.token)
        setWalletOpen(true)
    }

    const handleRequest = (event) => {
        notification.info({message: "Sending Request..."})
        requestAccess({
            courseId: courseId,
            token: auth?.token
        })
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
                            {role !== "Corporate" &&
                                ((course?.deadline && course?.startDate && moment().isBefore(course?.deadline) && moment().isAfter(course?.startDate)) ? (<>
                                    <Chip sx={{ color: "green", fontSize: 27, mb: 1, bgcolor: "var(--mainWhite)", p: 2 }} label={`${course?.currency} ${(course?.price * (100 - course?.discount) / 100).toFixed(2)}`} />
                                </>) : (<>
                                    <Chip sx={{ color: "var(--secColor)", fontSize: 27, mb: 1, bgcolor: "var(--mainWhite)", p: 2 }} label={`${course?.currency} ${course?.price}`} />
                                </>))
                            }
                            {role === "Trainee" && !course?.isEnrolled && (<>
                                <Button onClick={handleOpenWallet} sx={sec_button}><ShoppingCartCheckoutIcon /> Enroll in Course</Button>
                                <WalletModal wallet={auth?.wallet} open={walletOpen} handleClose={() => setWalletOpen(false)} action={handleEnroll} />
                            </>)}
                            {role === "Corporate" && !course?.isEnrolled && <Button onClick={handleRequest} sx={sec_button}><RequestPageIcon /> Request access</Button>}
                            {course?.isEnrolled && <Button onClick={() => navigate(`/courses/student/single/${courseId}`)} sx={sec_button}><ArrowForwardIosIcon /> Go to Course</Button>}
                        </Box>
                    </Grid>
                </Grid>
                <Typography variant="h5" sx={{ color: "var(--mainWhite)" }}>{course?.subject}</Typography>
                <Rating size='large' readOnly value={course?.rating} />
                <NavLink className="a2" to={`/course/ratings/${course?._id}`}>View {course?.numberOfRatings} Ratings</NavLink>
                <Typography textAlign="justify" variant="p" fontSize={18} sx={{ color: "var(--mainWhite)", mt: 2, mb: 10, maxWidth: "90%" }}>{course?.summary}</Typography>

            </Box>
            <Grid container direction="row" mb={2}>
                <Grid item xs={8} minHeight="100%">
                    <Box sx={{ ...centered_flex_box, minHeight: "100%" }}>
                        <Box sx={{ bgcolor: "var(--secWhite)", p: 1, minHeight: "100%" }}>
                            {course?.videoId ? <ReactPlayer controls={true} url={course?.videoId?.url} /> : <ReactPlayer controls={false} url="https://youtu.be/NpEaa2P7qZI" />}
                        </Box>
                    </Box>
                </Grid>
                <Grid sx={{ bgcolor: "var(--secWhite)", p: 2 }} item xs={4}>
                    <Grid container justifyContent="space-evenly" direction="column" sx={{ minHeight: "100%" }}>
                        <Grid item><Typography fontSize={27} ><School fontSize='large' />   {course?.instructorId?.name || course?.instructorId?.username}</Typography></Grid>
                        <Grid item><Typography fontSize={27} ><Stars fontSize='large' />   <NavLink className="a3" to={`/instructor/ratings/${course?.instructorId?._id}`}>View Instructor Ratings</NavLink></Typography></Grid>
                        <Grid item><Typography fontSize={27} ><GroupsIcon fontSize='large' />   {course?.enrolled} Students</Typography></Grid>
                        <Grid item><Typography fontSize={27} ><AccessTimeIcon fontSize='large' />   {course?.totalHours} Hours of content</Typography></Grid>
                        {role !== "Corporate" &&
                            ((course?.deadline && course?.startDate && moment().isBefore(course?.deadline) && moment().isAfter(course?.startDate)) ? (<>
                                <Grid item><Typography fontSize={27} ><AttachMoneyIcon fontSize='large' />   {course?.currency} {(course?.price * (100 - course?.discount) / 100).toFixed(2)}</Typography></Grid>
                                <Grid item><Typography fontSize={27} ><DiscountIcon fontSize='large' />   {course?.discount}% off</Typography></Grid>
                                <Grid item><Typography fontSize={27} ><AlarmOffIcon fontSize='large' />   Discount ends {moment(course?.deadline).fromNow()}</Typography></Grid>
                            </>) : (<>
                                <Grid item><Typography fontSize={27} ><AttachMoneyIcon fontSize='large' />   {course?.currency} {course?.price}</Typography></Grid>
                                <Grid item><Typography fontSize={27} ><DiscountIcon fontSize='large' />   No discount</Typography></Grid>
                            </>))
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

const mapDispatchToProps = { viewCourse, getWallet, getPaymentLink, requestAccess };

export default connect(mapStateToProps, mapDispatchToProps)(PreviewCourse);

