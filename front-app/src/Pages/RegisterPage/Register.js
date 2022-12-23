import React, { useState } from 'react'
import Checkbox from '@mui/material/Checkbox';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Typography, Box, Container, TextField, CssBaseline, Button, Avatar, Select, MenuItem, FormHelperText, InputLabel} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import countryList from 'country-json/src/country-by-name.json'
import { createUser } from '../../app/store/actions/authActions';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { connect } from "react-redux";

const theme = createTheme();



const Register = ({createUser}) => {
    const navigate = useNavigate();
        
    const[terms, setTerms] = useState(false);
    const handleTermsChange = (event) => {
    if(event.target.checked){
        setTerms(true)
    }
    else{
        setTerms(false)

    }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        var details = {
          username: data.get('username'),
          password: data.get('password'),
          corporation: data.get('corporation'),
          firstName: data.get('firstName'),
          lastName: data.get('lastName'),
          email: data.get('email'),
          gender: data.get('gender'),
          country: data.get('country'),
          acceptedTerms: terms
        }
        createUser(details)
        navigate("/")

      };

      const [country, setCountry] = useState("Egypt");
      const handleCountryChange = (event) => {
      setCountry(event.target.value)
      }

              

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email"
              id="email"
              autoComplete="email"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="corporation"
              label="Corporation"
              id="corporation"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="firstName"
              label="First Name"
              id="firstName"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="lastName"
              label="Last Name"
              id="lastName"
            />
            <Select
              margin="normal"
              required
              fullWidth
              autoFocus
              labelId='select-label'
              id="gender"
              label="Gender"
              name="gender"
              sx={{ mt: 2, mb: 1}}

            >
              <MenuItem value={"Male"}>Male</MenuItem>
              <MenuItem value={"Female"}>Female</MenuItem>
              <MenuItem value={"Other"}>Other</MenuItem>
            
            </Select>
            
            <Select
            margin="normal"
            defaultValue={country}
            fullWidth
            onChange={handleCountryChange}
            autoFocus
            labelId='select-label'
            id="country"
            label="Country"
            name="country"
            sx={{ mt: 2}}

            >
            {countryList.map((country) => {
                return (
                <MenuItem value={country.country}>
                    {country.country}
                </MenuItem>
                )
            })}
            </Select>
            
            <NavLink to="/terms" replace={false}> Please Read Terms and Conditions</NavLink>
            <Checkbox
                required
                sx={{ mt: 1, mb: 1}}
                name="acceptedTerms"
                id="acceptedTerms"
                onChange={handleTermsChange}
            />
            
            

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
 }
 const mapStateToProps = (state) => ({
    errors: state?.errors
  });
  
 const mapDispatchToProps = {createUser};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
