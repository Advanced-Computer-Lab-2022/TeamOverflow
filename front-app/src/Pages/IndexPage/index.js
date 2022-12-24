import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Typography, Box, Container, TextField, CssBaseline, Button, Avatar, Select, MenuItem, FormHelperText, InputLabel} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { LoginUser, guestVisit } from '../../app/store/actions/authActions';
import {Navigate, NavLink, Route, Routes} from "react-router-dom";
import { MainInput, main_button } from '../../app/components/Styles';

const theme = createTheme();

export const Index = ({LoginUser, user, token, guestVisit}) => {

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var details = {
      username: data.get('username'),
      password: data.get('password'),
      type: data.get('type')
    }
    LoginUser(details)
  };

  if(user?.type === "Guest User"){
    return (<Navigate to={"/courses"} replace/>)
  } else if(user) {
    return (<Navigate to={`/${token.split(" ")[0]}`} replace/>)
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            paddingTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
        <Avatar sx={{ m: 1, bgcolor: 'var(--secColor)' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
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
            <Select
              margin="normal"
              required
              fullWidth
              autoFocus
              labelId='select-label'
              id="type"
              label="User Type"
              name="type"
              
            >
              <MenuItem value={"Admin"}>Admin</MenuItem>
              <MenuItem value={"Instructor"}>Instructor</MenuItem>
              <MenuItem value={"Corporate"}>Corporate Trainee</MenuItem>
              <MenuItem value={"Trainee"}>Individual Trainee</MenuItem>
            </Select>
            <FormHelperText>User type to log in as</FormHelperText>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, ...main_button }}
            >
              Sign In
            </Button>
            <Grid container>
            <Grid item xs={12}>
                <NavLink to="/register">
                  Register
                </NavLink>
              </Grid>
              <Grid item xs={12}>
                <NavLink to="/forgot-password">
                  Forgot password?
                </NavLink>
              </Grid>
              <Grid item xs={12}>
                <NavLink onClick={guestVisit}>
                  Continue as guest?
                </NavLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => ({
  user : state?.auth?.user,
  token : state?.auth?.token
});

const mapDispatchToProps = {LoginUser, guestVisit};

export default connect(mapStateToProps, mapDispatchToProps)(Index);