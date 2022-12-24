import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { Rating, FormHelperText, Select, MenuItem, Button, Typography, Paper, IconButton, InputBase, Box, Container, Pagination, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Slider, Grid, Checkbox, Tooltip } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { filterCoursesAll, getSubjects, clearCourses } from '../../app/store/actions/coursesActions';
import { defineDiscount } from '../../app/store/actions/adminActions';
import { centered_flex_box, MainInput, main_button } from '../../app/components/Styles';
import moment from 'moment';


const theme = createTheme();
export const DefineDiscount = ({ token, courses, filterCoursesAll, clearCourses, getSubjects, isLoading, defineDiscount }) => {

    React.useEffect(() => {
        clearCourses()
        getSubjects()
    }, [])

    const initialState = {
        minPrice: 0,
        maxPrice: 5000,
        minRating: 0,
        maxRating: 5,
        subject: "",
        searchQuery: "",
        page: 1
    }

    const [formData, setFormData] = React.useState(initialState)

    const handleClearFilter = (event) => {
        setFormData(initialState)
        filterCoursesAll({ token: token, ...initialState });
    }

    const { minPrice, maxPrice, minRating, maxRating, searchQuery, page, subject } = formData

    const [drawerOpen, setDrawerOpen] = React.useState(false)

    const handlePriceChange = (event) => {
        setFormData({ ...formData, minPrice: event.target.value[0], maxPrice: event.target.value[1] })
    }

    const handleRatingChange = (event) => {
        setFormData({ ...formData, minRating: event.target.value[0], maxRating: event.target.value[1] })
    }

    const handleSubjectChange = (event) => {
        setFormData({ ...formData, subject: event.target.value })
    }

    const handleQueryChange = (event) => {
        setFormData({ ...formData, searchQuery: event.target.value })
    }

    const handlePageChange = (event, value) => {
        setFormData({ ...formData, page: value })
        filterCoursesAll({ token: token, ...formData, page: value });
    }

    const handleSearchFilter = (event) => {
        filterCoursesAll({ token: token, ...formData });
    }

    var [courseIds, setCourseIds] = React.useState([])

    const onChange = (event, courseId) => {
        if (event.target.checked) {
            courseIds.push(courseId)
        } else {
            courseIds = courseIds.filter((id) => (id !== courseId))
        }
    }

    const handleDefineDiscount = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget);
        var info = {
            discount: data.get('discount'),
            deadline: data.get('deadline'),
            courseIds: courseIds
        }
        defineDiscount({info: info, token: token})
        setCourseIds([])
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl">
                <Box sx={{ ...centered_flex_box, marginY: 2 }}>
                    <Typography variant="h3">Available Courses</Typography>
                </Box>
                <Box sx={centered_flex_box}>
                    <Paper
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "50%" }}
                    >
                        <IconButton sx={{ p: '10px' }} aria-label="menu" type="button" onClick={() => setDrawerOpen(!drawerOpen)}>
                            <FilterListIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search For Courses"
                            name="search"
                            id="search"
                            value={searchQuery}
                            onChange={handleQueryChange}
                        />
                        <IconButton sx={{ p: '10px' }} aria-label="search" onClick={handleSearchFilter}>
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </Box>
                {drawerOpen && (
                    <Grid container direction="row" display="flex" justifyContent="space-evenly" alignItems="center">
                        <Grid item xs={6} display="flex-row" alignItems="center">
                            <Accordion expanded={drawerOpen}>
                                <AccordionSummary
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>Filters</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    Rating Filter:
                                    <Slider
                                        step={1}
                                        max={5}
                                        value={[minRating, maxRating]}
                                        aria-label="Rating"
                                        onChange={handleRatingChange}
                                        valueLabelDisplay="auto"
                                    />
                                    Price Filter (USD):
                                    <Slider
                                        step={10}
                                        max={5000}
                                        value={[minPrice, maxPrice]}
                                        getAriaLabel={() => 'Price range'}
                                        onChange={handlePriceChange}
                                        valueLabelDisplay="auto"
                                    />
                                    Subject Filter:
                                    <Select
                                        label="Subject"
                                        id="Subject"
                                        name="subj"
                                        onChange={handleSubjectChange}
                                        value={subject}
                                        defaultValue=""
                                        fullWidth
                                    >
                                        <MenuItem key={-1} value="">
                                            Any
                                        </MenuItem>
                                        {courses?.subjects?.map((subject, i) => {
                                            return (
                                                <MenuItem key={i} value={subject}>
                                                    {subject}
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                    <FormHelperText>Select subject to filter</FormHelperText>
                                    <Button sx={{ ...main_button, margin: 1 }} onClick={handleSearchFilter}>Apply Filters</Button>
                                    <Button sx={{ ...main_button, margin: 1 }} onClick={handleClearFilter}>Clear Filters</Button>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>
                )}
                <hr />
                <Box component="form" onSubmit={handleDefineDiscount} sx={centered_flex_box}>
                    <MainInput required={true} name="discount" label="Discount %" inputProps={{ min: 0, max: 100 }} type="number" sx={{ mx: 1 }} />
                    <MainInput required={true} name="deadline" label="Discount Deadline" type="datetime-local" sx={{ mx: 1 }} />
                    <Tooltip title="Define Discount for current selection"><Button type="submit" sx={main_button}>Add Promotion</Button></Tooltip>
                </Box>
                <hr />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Select</TableCell>
                                <TableCell align="center">Course Title</TableCell>
                                <TableCell align="center">Course Subject</TableCell>
                                <TableCell align="center">Enrolled Students</TableCell>
                                <TableCell align="center">Rating</TableCell>
                                <TableCell align="center">Price</TableCell>
                                <TableCell align="center">Current Discount</TableCell>
                                <TableCell align="center">Current Deadline</TableCell>
                            </TableRow>
                        </TableHead>
                        {!isLoading ? (
                            <TableBody>
                                {courses?.docs?.map((course) => (
                                    <TableRow
                                        key={course._id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center"><Checkbox checked={courseIds.find((id) => id === course._id)} onChange={(event) => onChange(event, course._id)} /></TableCell>
                                        <TableCell align="center">{course.title}</TableCell>
                                        <TableCell align="center">{course.subject}</TableCell>
                                        <TableCell align="center">{course.enrolled}</TableCell>
                                        <TableCell align="center">
                                            <Rating
                                                fullWidth
                                                value={course.rating}
                                                readOnly
                                            /></TableCell>
                                        <TableCell align="center">USD {course.price}</TableCell>
                                        <TableCell align="center">{course.discount}</TableCell>
                                        <TableCell align="center">{moment().isAfter(course.deadline) ? "Expired" : (course.deadline ? "Ends in " + moment(course.deadline).fromNow() : "None")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            < TableCell align="center" colSpan={8}>
                                <CircularProgress sx={{ color: "var(--secColor)" }} />
                            </TableCell>
                        )}
                    </Table>
                </TableContainer>
                <Box sx={{ ...centered_flex_box, m: 1 }}>
                    <Pagination count={courses?.pages || 1} page={page} onChange={handlePageChange} />
                </Box>
            </Container>
        </ThemeProvider >
    );
}

const mapStateToProps = (state) => ({
    token: state?.auth?.token,
    courses: state?.courses?.results,
    isLoading: state?.courses?.isLoading
});

const mapDispatchToProps = { filterCoursesAll, getSubjects, clearCourses, defineDiscount };

export default connect(mapStateToProps, mapDispatchToProps)(DefineDiscount);