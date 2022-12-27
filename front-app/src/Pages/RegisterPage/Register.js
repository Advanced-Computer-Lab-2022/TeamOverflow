import React, { useState } from 'react'
import Checkbox from '@mui/material/Checkbox';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Typography, Box, Container, TextField, CssBaseline, Button, Avatar, Select, MenuItem, FormHelperText, InputLabel, FormControl} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import countryList from 'country-json/src/country-by-name.json'
import { createUser } from '../../app/store/actions/authActions';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { MainInput, MainInputLabel, main_button, StyledInput } from '../../app/components/Styles';
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
          name: data.get('firstName')+" "+data.get('lastName'),
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
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
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
            <MainInput
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <MainInput
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <MainInput
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email"
              id="email"
              autoComplete="email"
            />
            <MainInput
              margin="normal"
              required
              fullWidth
              name="firstName"
              label="First Name"
              id="firstName"
            />
            <MainInput
              margin="normal"
              required
              fullWidth
              name="lastName"
              label="Last Name"
              id="lastName"
            />
            
            <FormControl sx={{minWidth:"100%", mt: 2 }}>
            <MainInputLabel id="gender-label" title="Gender"/>
            <Select
              margin="normal"
              fullWidth
              labelId='gender-label'
              input={<StyledInput/>}
              id="gender"
              label="Gender"
              name="gender"

            >
              <MenuItem value={"Male"}>Male</MenuItem>
              <MenuItem value={"Female"}>Female</MenuItem>
              <MenuItem value={"Other"}>Other</MenuItem>
            </Select>

            </FormControl>
            <FormControl sx={{minWidth:"100%", mt: 2 }}>
            <MainInputLabel required id="country-label" title="Country"/>
            <Select
            margin="normal"
            defaultValue={country}
            fullWidth
            required
            onChange={handleCountryChange}
            input={<StyledInput/>}
            labelId='country-label'
            id="country"
            label="Country"
            name="country"

            >
            {countryList.map((country) => {
                return (
                <MenuItem value={country.country}>
                    {country.country}
                </MenuItem>
                )
            })}
            </Select>
            </FormControl>
            
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
              sx={{ mt: 3, mb: 2, ...main_button }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Container>
  )
 }
 const mapStateToProps = (state) => ({
    errors: state?.errors
  });
  
 const mapDispatchToProps = {createUser};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
