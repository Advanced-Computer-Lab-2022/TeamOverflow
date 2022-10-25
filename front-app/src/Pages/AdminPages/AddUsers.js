import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {Typography, Box, Container, TextField, CssBaseline, Button, Avatar, Select, MenuItem, InputLabel, FormHelperText} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { addUser } from '../../app/store/actions/adminActions';

const theme = createTheme();

export const AddUsers = ({addUser, auth}) => {

  const [isCorporate, setIsCorporate] = React.useState(false)

  const onUserTypeChange = (event) => {
    if(event.target.value === "Corporate") {
        setIsCorporate(true);
    } else {
        setIsCorporate(false);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var details = {
      username: data.get('username'),
      password: data.get('password'),
      corporation: data.get('corporation'),
      type: data.get('type'),
      token: auth.token
    }
    addUser(details)
  };

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
            <AccountCircleIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create a user
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
            {isCorporate && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="corporation"
              label="Corporation"
              type="corporation"
              id="corporation"
            />) }
            <InputLabel id="select-label">User Type</InputLabel>
            <Select
              margin="normal"
              required
              fullWidth
              autoFocus
              labelId='select-label'
              id="type"
              label="User Type"
              name="type"
              onChange={onUserTypeChange}
            >
              <MenuItem value={"Admin"}>Admin</MenuItem>
              <MenuItem value={"Instructor"}>Instructor</MenuItem>
              <MenuItem value={"Corporate"}>Corporate Trainee</MenuItem>
            </Select>
            <FormHelperText>Choose user type to create</FormHelperText>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => ({
    auth: state?.auth
});

const mapDispatchToProps = {addUser};

export default connect(mapStateToProps, mapDispatchToProps)(AddUsers);