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
import { addAccess, getCorporations } from '../../app/store/actions/adminActions';
import { centered_flex_box, MainInput, MainInputLabel, main_button, StyledInput } from '../../app/components/Styles';
import moment from 'moment';


const theme = createTheme();
export const AddAccess = ({ token, courses, filterCoursesAll, clearCourses, getSubjects, isLoading, addAccess, corporations, getCorporations, subjects }) => {

    React.useEffect(() => {
        clearCourses()
        getSubjects()
        getCorporations(token)
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

    const handleAddAccess = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget);
        var ids = courses.docs.filter((course) => courseIds[course._id]).map((course) => course._id)
        var info = {
            corporation: data.get('corporation'),
            courseIds: ids
        }
        addAccess({ info: info, token: token })
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
                                            {subjects?.map((subject, i) => {
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
                <Box component="form" onSubmit={handleAddAccess} sx={{...centered_flex_box, alignItems: 'center', width: "100%"}}>
                    <FormControl sx={{ mt: 1, minWidth:"20%" }}>
                        <MainInputLabel id="corporation-label" title="Corporation" />
                        <Select
                            label="Corporation"
                            id="corporation"
                            name="corporation"
                            labelId='corporation-label'
                            input={<StyledInput />}
                            fullWidth
                        >
                            {corporations?.map((corporate, i) => {
                                return (
                                    <MenuItem key={i} value={corporate}>
                                        {corporate}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <Tooltip title="Grant access to this corporation's users to the course(s) selected"><Button type="submit" sx={{mx:1, ...main_button}}>Grant Access</Button></Tooltip>
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
                                <TableCell align="center">Discounted Price</TableCell>
                            </TableRow>
                        </TableHead>
                        {!isLoading ? (
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center">
                                        Select All <br /><Checkbox checked={isAllSelected} onChange={handleSelectAll} />
                                    </TableCell>
                                    <TableCell align="center" colSpan={7} />
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
                                        <TableCell align="center">USD {course.discount && moment().isBefore(course.deadline) && moment().isAfter(course.startDate) ? (course.price*((100-Accordion.discount)/100)).toFixed(2) : course.price}</TableCell>
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
    subjects: state?.courses?.subjects,
    isLoading: state?.courses?.isLoading,
    corporations: state?.auth?.corporations
});

const mapDispatchToProps = { filterCoursesAll, getSubjects, clearCourses, addAccess, getCorporations };

export default connect(mapStateToProps, mapDispatchToProps)(AddAccess);