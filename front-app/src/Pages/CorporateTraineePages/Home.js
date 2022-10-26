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

const theme = createTheme();

export const Home = ({auth, logout}) => {
  console.log(countryList)
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <CssBaseline/>
        <Typography>Corporate Trainee Home Page</Typography>
        <Typography>Welcome {auth.user.username}</Typography>
        <NavLink to="/courses">Courses Page</NavLink><br/>
        <Select 
          defaultValue={auth.user.country}
          label="User Country"
          fullWidth        
        >
          {countryList.map((country) => {return (
            <MenuItem value={country.country}>
              {country.country}
            </MenuItem>
          )})}
        </Select>
        <FormHelperText>Select your country</FormHelperText>
        <Button>Set Country</Button><br/>
        <Button onClick={logout}>Log Out</Button>
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => ({
    auth: state?.auth
});

const mapDispatchToProps = {logout};

export default connect(mapStateToProps, mapDispatchToProps)(Home);