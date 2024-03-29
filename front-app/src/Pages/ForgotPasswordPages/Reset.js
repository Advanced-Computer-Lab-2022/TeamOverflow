import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Box, Container, TextField, CssBaseline, Button, Avatar, Select, MenuItem, FormHelperText, InputLabel } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { resetPassword } from '../../app/store/actions/authActions';
import { Navigate, NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { MainInput, main_button } from '../../app/components/Styles';

const theme = createTheme();

export const Reset = ({ resetPassword }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var details = {
      password: data.get('password'),
      token: token
    }
    resetPassword(details)
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
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
            id="password"
            label="New Password"
            name="password"
            type="password"
            autoComplete="new-password"
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, ...main_button }}
          >
            Reset Password
          </Button>
          <Button
            variant="contained"
            sx={{ mt: 3, mb: 2, ...main_button }}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = { resetPassword };

export default connect(mapStateToProps, mapDispatchToProps)(Reset);