import * as React from 'react';
import { Typography, Container, CssBaseline, Button, FormHelperText, Select, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../app/store/actions/authActions';
import countryList from 'country-json/src/country-by-name.json'
import { selectCountry } from '../../app/store/actions/traineeActions';

const theme = createTheme();

export const Home = ({ auth, logout, selectCountry }) => {

  const navigate = useNavigate();

  const [country, setCountry] = React.useState(auth.user.country)
  const handleCountryChange = (event) => {
    setCountry(event.target.value)
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <CssBaseline />
        <Typography>Home Page</Typography>
        <Typography>Welcome {auth.user.username}</Typography>
        <NavLink to="/courses">Courses Page</NavLink><br />
        {/* <NavLink to="/Trainee/profile">My Profile</NavLink><br/> */}
        <NavLink to="/courses/student">My registered courses</NavLink><br />
        <Select
          defaultValue={country}
          label="User Country"
          fullWidth
          onChange={handleCountryChange}
        >
          {countryList.map((country) => {
            return (
              <MenuItem value={country.country}>
                {country.country}
              </MenuItem>
            )
          })}
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

const mapDispatchToProps = { logout, selectCountry };

export default connect(mapStateToProps, mapDispatchToProps)(Home);