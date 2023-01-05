import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { Rating, FormHelperText, Select, MenuItem, Button, Typography, Paper, IconButton, InputBase, Box, Container, Pagination, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Slider, Grid, Checkbox, Tooltip, FormControl, InputLabel } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { filterCoursesAll, getSubjects, clearCourses } from '../../app/store/actions/coursesActions';
import { defineDiscount } from '../../app/store/actions/adminActions';
import { centered_flex_box, MainInput, MainInputLabel, main_button, StyledInput } from '../../app/components/Styles';
import moment from 'moment';


const theme = createTheme();
export const DefineDiscount = ({ token, courses, filterCoursesAll, clearCourses, getSubjects, isLoading, defineDiscount, waiting }) => {

    React.useEffect(() => {
        clearCourses()
        getSubjects()
        filterCoursesAll({ token: token, ...formData });
        !isLoading && courses?.docs?.map((course) => courseIds[course._id] = false)
        setIsAllSelected(false)
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
        !isLoading && courses?.docs?.map((course) => courseIds[course._id] = false)
        setIsAllSelected(false)
    }

    const { minPrice, maxPrice, minRating, maxRating, searchQuery, page, subject } = formData

    const [drawerOpen, setDrawerOpen] = React.useState(false)

    const handlePriceChange = (event) => {
        setFormData({ ...formData, minPrice: event.target.value[0], maxPrice: event.target.value[1] })
    }

    const handleMinPriceChange = (event) => {
        setFormData({ ...formData, minPrice: event.target.value })
    }

    const handleMaxPriceChange = (event) => {
        setFormData({ ...formData, maxPrice: event.target.value })
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
        !isLoading && courses?.docs?.map((course) => courseIds[course._id] = false)
        setIsAllSelected(false)
    }

    const handleSearchFilter = (event) => {
        filterCoursesAll({ token: token, ...formData });
        !isLoading && courses?.docs?.map((course) => courseIds[course._id] = false)
        setIsAllSelected(false)
    }

    var [courseIds, setCourseIds] = React.useState({})

    const onChange = (event, courseId) => {
        setCourseIds({ ...courseIds, [courseId]: event.target.checked })
        if (isAllSelected) {
            setIsAllSelected(event.target.checked)
        }
    }

    const handleDefineDiscount = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget);
        var ids = courses.docs.filter((course) => courseIds[course._id]).map((course) => course._id)
        var info = {
            discount: data.get('discount'),
            startDate: data.get('startDate'),
            deadline: data.get('deadline'),
            courseIds: ids
        }
        defineDiscount({ info: info, token: token })
        filterCoursesAll({ token: token, ...formData });
        !isLoading && courses?.docs?.map((course) => courseIds[course._id] = false)
        setIsAllSelected(false)
    }

    const handleSelectAll = (event) => {
        var ids = {}
        courses?.docs?.map((course) => ids[course._id] = event.target.checked)
        setCourseIds(ids)
        setIsAllSelected(event.target.checked)
    }

    const [isAllSelected, setIsAllSelected] = React.useState(false)

    if (waiting?.isLoading) {
        return (
            <Box sx={{ ...centered_flex_box, minHeight: "100vh" }}>
                <CircularProgress sx={{ color: "var(--secColor)" }} />
            </Box>
        )
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
                                    <Box display="flex" justifyContent="space-between">
                                        <MainInput label="Min" focused type="number" value={minPrice} onChange={handleMinPriceChange} />
                                        <MainInput label="Max" focused type="number" value={maxPrice} onChange={handleMaxPriceChange} />
                                    </Box>
                                    Subject Filter:
                                    <FormControl sx={{ minWidth: "100%", mt: 1 }}>
                                        <MainInputLabel id="subject-label" title="Subject" />
                                        <Select
                                            label="Subject"
                                            id="Subject"
                                            name="subj"
                                            labelId='subject-label'
                                            onChange={handleSubjectChange}
                                            input={<StyledInput />}
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
                                    </FormControl>

                                    <Button sx={{ ...main_button, margin: 1 }} onClick={handleSearchFilter}>Apply Filters</Button>
                                    <Button sx={{ ...main_button, margin: 1 }} onClick={handleClearFilter}>Clear Filters</Button>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>
                )}
                <hr />
                <Box component="form" onSubmit={handleDefineDiscount} sx={centered_flex_box}>
                    <MainInput required={true} focused name="discount" label="Discount %" inputProps={{ min: 0, max: 100 }} type="number" sx={{ mx: 1 }} />
                    <MainInput required={true} focused name="startDate" label="Discount Start Date" type="datetime-local" sx={{ mx: 1 }} />
                    <MainInput required={true} focused name="deadline" label="Discount Deadline" type="datetime-local" sx={{ mx: 1 }} />
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
                                <TableCell align="center">Current Start Date</TableCell>
                                <TableCell align="center">Current Deadline</TableCell>
                            </TableRow>
                        </TableHead>
                        {!isLoading ? (
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center">
                                        Select All <br /><Checkbox checked={isAllSelected} onChange={handleSelectAll} />
                                    </TableCell>
                                    <TableCell align="center" colSpan={8} />
                                </TableRow>
                                {courses?.docs?.map((course) => (
                                    <TableRow
                                        key={course._id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center"><Checkbox checked={courseIds[course._id]} onChange={(event) => onChange(event, course._id)} /></TableCell>
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
                                        <TableCell align="center">{course.startDate ? (moment().isAfter(course.startDate) ? `Started ${moment(course.startDate).fromNow()}` : `Starting in ${moment(course.startDate).fromNow()}`) : "None"}</TableCell>
                                        <TableCell align="center">{moment().isAfter(course.deadline) ? "Expired" : (course.deadline ? "Ends in " + moment(course.deadline).fromNow() : "None")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            < TableCell align="center" colSpan={9}>
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
    isLoading: state?.courses?.isLoading,
    waiting: state?.waiting
});

const mapDispatchToProps = { filterCoursesAll, getSubjects, clearCourses, defineDiscount };

export default connect(mapStateToProps, mapDispatchToProps)(DefineDiscount);