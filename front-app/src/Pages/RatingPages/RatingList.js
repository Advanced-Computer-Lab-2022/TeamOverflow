import * as React from 'react';
import { Typography, Paper, IconButton, InputBase, Box, Container, Pagination, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Button, Slider, Select, MenuItem, Card, FormHelperText, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { viewReports, clearReports } from '../../app/store/actions/reportActions';
import { CourseCard, ReportCard, ReviewCard } from '../../app/components';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InboxIcon from '@mui/icons-material/Inbox';
import SearchIcon from '@mui/icons-material/Search';
import { centered_flex_box, main_button } from '../../app/components/Styles';
import { useLocation, useParams } from 'react-router-dom';
import { getCoursesRatings, getInstructorRatings, viewCoursesRatings, viewInstructorRatings } from '../../app/store/actions/ratingActions';

const theme = createTheme();

export const RatingsList = ({ auth, ratings, getCoursesRatings, getInstructorRatings, viewCoursesRatings, viewInstructorRatings, isLoading }) => {

    const role = auth?.token?.split(" ")[0];
    const location = useLocation();
    const params = useParams();

    const [title, setTitle] = React.useState("Ratings and Reviews")

    const [formData, setFormData] = React.useState({
        page: 1,
        courseId: undefined,
        instructorId: undefined
    })

    const { page } = formData

    const handlePageChange = (event, value) => {
        setFormData({ ...formData, page: value })
        if (location.pathname.includes("/courses/ratings") && role === "Instructor") {
            setTitle("Course Ratings");
            setFormData({ ...formData, courseId: params?.id })
            getCoursesRatings({ ...formData, courseId: params?.id, token: auth?.token })
        } else if (location.pathname.includes("/course/ratings") && role !== "Instructor") {
            setTitle("Course Ratings");
            setFormData({ ...formData, courseId: params?.id })
            viewCoursesRatings({ ...formData, courseId: params?.id, token: auth?.token })
        } else if (location.pathname === "/Instructor/ratings" && role === "Instructor") {
            setTitle("My Ratings");
            getInstructorRatings({ page: 1, token: auth?.token })
        } else if (location.pathname.includes("/instructor/ratings") && role !== "Instructor") {
            setTitle("Instructor Ratings");
            setFormData({ ...formData, instructorId: params?.id })
            viewInstructorRatings({ ...formData, instructorId: params?.id, token: auth?.token })
        }
    }

    React.useEffect(() => {
        if (location.pathname.includes("/courses/ratings") && role === "Instructor") {
            setTitle("Course Ratings");
            setFormData({ ...formData, courseId: params?.id })
            getCoursesRatings({ ...formData, courseId: params?.id, token: auth?.token })
        } else if (location.pathname.includes("/course/ratings") && role !== "Instructor") {
            setTitle("Single Course Ratings");
            setFormData({ ...formData, courseId: params?.id })
            viewCoursesRatings({ ...formData, courseId: params?.id, token: auth?.token })
        } else if (location.pathname === "/Instructor/ratings" && role === "Instructor") {
            setTitle("My Ratings");
            getInstructorRatings({ page: 1, token: auth?.token })
        } else if (location.pathname.includes("/instructor/ratings") && role !== "Instructor") {
            setTitle("Instructor Ratings");
            setFormData({ ...formData, instructorId: params?.id })
            viewInstructorRatings({ ...formData, instructorId: params?.id, token: auth?.token })
        }
    }, [location])

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl">
                <Box sx={{ ...centered_flex_box, marginY: 2 }}>
                    <Typography variant="h3">{title}</Typography>
                </Box>
                <hr />
                <Box>
                    {!isLoading ? (
                        <Grid container spacing={2} sx={centered_flex_box}>
                            {ratings?.docs?.map((rating) => {
                                return (
                                    <Grid item xs={5}>
                                        <ReviewCard rating={rating} />
                                    </Grid>
                                )
                            })}
                            {ratings?.docs?.length === 0 && (
                                <Grid item sx={{ ...centered_flex_box, flexDirection: "column", mt: 2 }}>
                                    <InboxIcon fontSize="large" />
                                    <Typography fontSize={40}>No results</Typography>
                                </Grid>
                            )}
                        </Grid>
                    ) : (
                        <Box sx={centered_flex_box}>
                            <CircularProgress sx={{ color: "var(--secColor)" }} />
                        </Box>
                    )}
                    <Box sx={{ ...centered_flex_box, m: 1 }}>
                        <Pagination count={ratings?.pages || 1} page={page} onChange={handlePageChange} />
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

const mapStateToProps = (state) => ({
    auth: state?.auth,
    ratings: state?.ratings?.ratings,
    isLoading: state?.ratings?.isLoading
});

const mapDispatchToProps = { getCoursesRatings, getInstructorRatings, viewCoursesRatings, viewInstructorRatings };

export default connect(mapStateToProps, mapDispatchToProps)(RatingsList);