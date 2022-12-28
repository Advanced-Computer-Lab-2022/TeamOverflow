import * as React from 'react';
import { Typography, Paper, IconButton, InputBase, Box, Container, Pagination, TextField, Accordion, AccordionSummary, AccordionDetails, Button, Slider, Select, MenuItem, Card, FormHelperText, Grid, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { getRegisteredCourses } from '../../app/store/actions/coursesActions';
import { RegisteredCourseCard } from '../../app/components';
import InboxIcon from '@mui/icons-material/Inbox';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { centered_flex_box, main_button } from '../../app/components/Styles';

const theme = createTheme();

export const TraineeRegisteredCourses = ({ auth, courses, getRegisteredCourses }) => {

    const role = auth?.token?.split(" ")[0];

    const [page, setPage] = React.useState(parseInt(courses?.results?.page) || 1)

    React.useEffect(() => {
        getRegisteredCourses({ token: auth?.token, page });
    }, [])

    const handlePageChange = (event, value) => {
        setPage(value)
        getRegisteredCourses({ token: auth?.token, page });
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl">
                <Box sx={{ ...centered_flex_box, marginY: 2 }}>
                    <Typography variant="h3">Your Registered Courses</Typography>
                </Box>
                <hr />
                <Box>
                    {!courses?.isLoading ? (
                        <Grid container spacing={3} sx={centered_flex_box}>
                            {courses?.results?.docs?.map((courseData) => {
                                return (
                                    <Grid item xs={5}>
                                        <RegisteredCourseCard courseData={courseData} />
                                    </Grid>
                                )
                            })}
                            {courses?.results?.docs?.length === 0 && (
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
                        <Pagination count={courses?.results?.pages || 1} page={page} onChange={handlePageChange} />
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

const mapStateToProps = (state) => ({
    auth: state?.auth,
    courses: state?.courses
});

const mapDispatchToProps = { getRegisteredCourses };

export default connect(mapStateToProps, mapDispatchToProps)(TraineeRegisteredCourses);