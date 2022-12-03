import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Typography, Box, Container, CssBaseline, Button, FormHelperText, Select, MenuItem} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import { logout } from '../../app/store/actions/authActions';
import countryList from 'country-json/src/country-by-name.json'
import { selectCountry } from '../../app/store/actions/instructorActions';
import { getCoursesRatings, getInstructorRatings } from '../../app/store/actions/ratingActions';

const theme = createTheme();
export const Home = ({auth, logout, selectCountry, getCoursesRatings, getInstructorRatings}) => {
  
  const [country, setCountry] = React.useState(auth.user.country)
  const handleCountryChange = (event) => {
    setCountry(event.target.value)
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <CssBaseline/>
        <Typography>Instructor Home Page</Typography>
        <Typography>Welcome {auth.user.username}</Typography>
        <NavLink to="/Instructor/profile">My Profile</NavLink><br/>
        <NavLink to="/Instructor/contract">My Contract</NavLink><br/>
        <NavLink onClick={() => getInstructorRatings(auth?.token)} to="/Instructor/ratings">My Ratings and Reviews</NavLink><br/>
        <NavLink to="/courses">All Courses</NavLink><br/>
        <NavLink to="/courses/instructor">My Courses</NavLink><br/>
        <NavLink to="/courses/create">Add Courses</NavLink><br/>
        <NavLink onClick={() => getCoursesRatings(auth?.token)} to="/courses/ratings">My Courses Ratings and Reviews</NavLink><br/>
        <Select 
          defaultValue={country}
          label="User Country"
          fullWidth
          onChange={handleCountryChange}        
        >
          {countryList.map((country, i) => {return (
            <MenuItem key={i} value={country.country}>
              {country.country}
            </MenuItem>
          )})}
        </Select>
        <FormHelperText>Select your country</FormHelperText>
        <Button onClick={() => selectCountry({token: auth.token, country: country})}>Set Country</Button><br/>
        <Button onClick={logout}>Log Out</Button>
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => ({
    auth: state?.auth
});

const mapDispatchToProps = {logout, selectCountry, getCoursesRatings, getInstructorRatings};

export default connect(mapStateToProps, mapDispatchToProps)(Home);