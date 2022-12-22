import * as React from 'react';
import { Typography, Paper, IconButton, InputBase, Box, Container, Pagination, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Button, Slider, Select, MenuItem, Card, FormHelperText, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { clearCourses, filterCoursesInstructor, getSubjects } from '../../app/store/actions/coursesActions';
import { CourseCard } from '../../app/components';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { centered_flex_box, main_button } from '../../app/components/Styles';

const theme = createTheme();

export const InstructorCourses = ({ auth, courses, getSubjects, filterCoursesInstructor, clearCourses }) => {

  const role = auth.token.split(" ")[0];

  React.useEffect(() => {
    clearCourses()
    getSubjects()
  }, [])

  const [formData, setFormData] = React.useState({
    minPrice: 0,
    maxPrice: 5000,
    minRating: 0,
    maxRating: 5,
    subject: "",
    searchQuery: "",
    page: parseInt(courses?.results?.page) || 1
  })

  const handleClearFilter = (event) => {
    setFormData({
      minPrice: 0,
      maxPrice: 5000,
      minRating: 0,
      maxRating: 5,
      subject: "",
      searchQuery: "",
      page: 1
    })
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
    filterCoursesInstructor({ token: auth.token, ...formData });
  }

  const handleSearchFilter = (event) => {
    filterCoursesInstructor({ token: auth.token, ...formData });
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <Box sx={{ ...centered_flex_box, marginY: 2 }}>
          <Typography variant="h3">Your Courses</Typography>
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
                  {role !== "Corporate" && (
                    <>
                      Price Filter (USD):
                      <Slider
                        step={10}
                        max={5000}
                        value={[minPrice, maxPrice]}
                        getAriaLabel={() => 'Price range'}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                      />
                    </>)}
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
        <Box>
          {!courses?.isLoading ? (
            <Grid container spacing={1}>
              {courses?.results?.docs?.map((course) => {
                return (
                  <Grid item xs={12}>
                    <CourseCard course={course} />
                  </Grid>
                )
              })}
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

const mapDispatchToProps = { filterCoursesInstructor, getSubjects, clearCourses };

export default connect(mapStateToProps, mapDispatchToProps)(InstructorCourses);