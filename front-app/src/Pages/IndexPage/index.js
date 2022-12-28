import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Box, Container, TextField, CssBaseline, Button, Avatar, Select, MenuItem, FormHelperText, InputLabel, CircularProgress, FormControl } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { LoginUser, guestVisit } from '../../app/store/actions/authActions';
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { centered_flex_box, MainInput, MainInputLabel, main_button, StyledInput } from '../../app/components/Styles';

const theme = createTheme();

export const Index = ({ LoginUser, user, token, guestVisit, isLoading }) => {

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

  if (user?.type === "Guest User") {
    return (<Navigate to={"/courses"} replace />)
  } else if (user) {
    return (<Navigate to={`/${token.split(" ")[0]}`} replace />)
  }

  if (isLoading) {
    return (
      <Box sx={{ ...centered_flex_box, minHeight: "100vh" }}>
        <CircularProgress sx={{ color: "var(--secColor)" }} />
      </Box>
    )
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
  user: state?.auth?.user,
  isLoading: state?.auth?.isLoading,
  token: state?.auth?.token
});

const mapDispatchToProps = { LoginUser, guestVisit };

export default connect(mapStateToProps, mapDispatchToProps)(Index);