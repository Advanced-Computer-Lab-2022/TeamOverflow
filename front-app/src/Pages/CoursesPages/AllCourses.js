import * as React from 'react';
import { Typography, Box, Container, TextField, Accordion, AccordionSummary, AccordionDetails, Button, Slider, Select, MenuItem, Card, FormHelperText, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { searchCoursesUsers, viewTitles, viewCourse, viewPrices, filterCoursesAll, getSubjects } from '../../app/store/actions/coursesActions';
import { CourseCard } from '../../app/components';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { centered_flex_box, main_button } from '../../app/components/Styles';

const theme = createTheme();

export const AllCourses = ({ auth, courses, getSubjects, searchCoursesUsers, filterCoursesAll }) => {

  const role = auth.token.split(" ")[0];

  React.useEffect(() => {
    getSubjects()
  }, [])

  const handleSearch = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var details = {
      searchQuery: data.get('search'),
      token: auth.token
    }
    searchCoursesUsers(details);
  };

  const [formData, setFormData] = React.useState({
    minPrice: 0,
    maxPrice: 5000,
    minRating: 0,
    maxRating: 5,
    subject: ""
  })

  const handleClearFilter = (event) => {
    setFormData({
      minPrice: 0,
      maxPrice: 5000,
      minRating: 0,
      maxRating: 5,
      subject: ""
    })
  }

  const { minPrice, maxPrice, minRating, maxRating, subject } = formData

  const handlePriceChange = (event) => {
    setFormData({ ...formData, minPrice: event.target.value[0], maxPrice: event.target.value[1] })
  }

  const handleRatingChange = (event) => {
    setFormData({ ...formData, minRating: event.target.value[0], maxRating: event.target.value[1] })
  }

  const handleSubjectChange = (event) => {
    setFormData({ ...formData, subject: event.target.value })
  }

  const handleFilter = (event) => {
    filterCoursesAll({ token: auth.token, ...formData });
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <Box sx={{ ...centered_flex_box, marginY: 2 }}>
          <Typography variant="h3">Available Courses</Typography>
        </Box>
        <Grid container direction="row" display="flex" justifyContent="space-evenly" alignItems="center">
          <Grid item xs={6} display="flex-row" alignItems="center">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
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
                <Button sx={{ ...main_button, margin: 1 }} onClick={handleFilter}>Apply Filters</Button>
                <Button sx={{ ...main_button, margin: 1 }} onClick={handleClearFilter}>Clear Filters</Button>
              </AccordionDetails>
            </Accordion>

          </Grid>
          <Grid item xs={6}>
            <Box component="form" onSubmit={handleSearch}>
              <Grid container>
                <Grid item xs={10} sx={{ padding: 2 }}>
                  <TextField
                    margin="normal"
                    id="search"
                    type="search"
                    fullWidth={true}
                    label="Search"
                    name="search"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={2} sx={centered_flex_box}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2, mx: 2, ...main_button }}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <hr />
        <Box>
          <Grid container spacing={1}>
            {courses.results?.map((course) => {
              return (
                <Grid item xs={12}>
                  <CourseCard course={course} />
                </Grid>
              )
            })}
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => ({
  auth: state?.auth,
  courses: state?.courses
});

const mapDispatchToProps = { searchCoursesUsers, viewTitles, viewCourse, viewPrices, filterCoursesAll, getSubjects };

export default connect(mapStateToProps, mapDispatchToProps)(AllCourses);