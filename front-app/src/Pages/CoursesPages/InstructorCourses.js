import * as React from 'react';
import { Typography, Box, Container, TextField, CssBaseline, Button, Slider, Select, MenuItem ,FormHelperText, Card } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { viewTitlesInstructor, viewCourse, searchCoursesInstructor, filterCoursesInstructor, getSubjects } from '../../app/store/actions/coursesActions';

const theme = createTheme();

export const InstructorCourses = ({ auth, getSubjects ,courses, viewTitlesInstructor, viewCourse, searchCoursesInstructor, filterCoursesInstructor }) => {

  const role = auth.token.split(" ")[0];

  React.useEffect(() => {
    getSubjects()
  },[])

  const onView = (id) => {
    if (role !== "Corporate") viewCourse({ id: id, token: auth.token })
  }

  const handleSearch = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var details = {
      searchQuery: data.get('search'),
      token: auth.token
    }
    searchCoursesInstructor(details);
  };

  const [priceRange, setPriceRange] = React.useState([10, 100])
  const handlePriceChange = (event) => {
    setPriceRange(event.target.value)
  }

  const [subject, setSubject] = React.useState(null)
  const handleFilter = (event) => {
    filterCoursesInstructor({ token: auth.token, subject: subject, minPrice: priceRange[0], maxPrice: priceRange[1] });
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <CssBaseline />
        <Typography>Your Courses</Typography>
        <Box>
          <Button variant="contained" onClick={() => viewTitlesInstructor({ token: auth.token })}>View all my courses</Button>
        </Box>
        <Box component="form" onSubmit={handleSearch} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="search"
            label="Search for my courses by subject or title"
            name="search"
            autoComplete="search"
            autoFocus
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Search
          </Button>
        </Box>
        <hr />
        <Box>
          <Typography>Filters</Typography>
          Price (USD):
          <Slider
            step={10}
            max={1000}
            value={priceRange}
            getAriaLabel={() => 'Price range'}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
          />
          <Select
            label="Subject"
            id="Subject"
            name="subj"
            onChange={(event) => setSubject(event.target.value)}
            fullWidth
          >
            {courses?.subjects?.map((subject, i) => {
              return (
                <MenuItem key={i} value={subject}>
                  {subject}
                </MenuItem>
              )
            })}
          </Select>
          <FormHelperText>Select subject to filter</FormHelperText>
          <Button variant="contained" onClick={handleFilter}>Apply Price/Subject Filter</Button>
        </Box>
        <hr />
        <Box>
          <Typography>Results</Typography>
          <Box>
            {courses.results?.map((course) => {
              return (
                <Box className='m-2'>
                <Card onClick={() => onView(course._id)}>
                    Title: {course.title}
                    <br />
                    {course.subject && 
                    <>
                    Subject: {course.subject}
                    <br />
                    </>}
                    {course.summary && 
                    <>
                    Summary: {course.summary}
                    <br />
                    </>}
                    {course.rating && 
                    <>
                    Rating: {course.rating}/5
                    <br />
                    </>}
                    {course.price && 
                    <>
                    Price: {course.price}
                    <br />
                    </>}
                    {course.discount && 
                    <>
                    Discount: {course.discount}
                    <br />
                    </>}
                    {course.totalHours && 
                    <>
                    Total Hours: {course.totalHours}
                    <br />
                    </>}
                  </Card>
                  <pre>{courses.single?._id === course._id && JSON.stringify(courses.single)}</pre>
                </Box>
              )
            })}
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

const mapDispatchToProps = { viewTitlesInstructor, getSubjects, viewCourse, searchCoursesInstructor, filterCoursesInstructor };

export default connect(mapStateToProps, mapDispatchToProps)(InstructorCourses);