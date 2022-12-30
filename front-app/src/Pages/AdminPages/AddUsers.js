import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Typography, Box, Container, TextField, CssBaseline, Button, Avatar, Select, MenuItem, InputLabel, FormHelperText, FormControl } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { addUser, addUsers } from '../../app/store/actions/adminActions';
import { MainInput, MainInputLabel, main_button, StyledInput } from '../../app/components/Styles';
import { useNavigate } from 'react-router-dom';
import ReactFileReader from 'react-file-reader';
import download from 'downloadjs';
import { notification } from 'antd';

const theme = createTheme();

export const AddUsers = ({ addUser, auth, addUsers }) => {

  const navigate = useNavigate()
  const [isCorporate, setIsCorporate] = React.useState(false)

  const onUserTypeChange = (event) => {
    if (event.target.value === "Corporate") {
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
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      corporation: data.get('corporation'),
      type: data.get('type'),
      token: auth.token
    }
    addUser(details, navigate)
  };

  const handleFiles = files => {
    var reader = new FileReader()
    reader.readAsText(files[0])
    reader.onload = () => {
      var splitted = reader?.result?.split(/['\r\n',]/)
      console.log(splitted)
      var admins = []
      var instructors = []
      var trainees = []
      try {
        for (let i = 7; i < splitted.length - 7; i += 7) {
          console.log(splitted[i])
          if (splitted[i + 4].toLowerCase() === "admin") {
            admins.push({
              username: splitted[i],
              password: splitted[i + 1],
              name: splitted[i + 2],
              email: splitted[i + 3]
            })
          } else if (splitted[i + 4].toLowerCase() === "instructor") {
            instructors.push({
              username: splitted[i],
              password: splitted[i + 1],
              name: splitted[i + 2],
              email: splitted[i + 3]
            })
          } else if (splitted[i + 4].toLowerCase() === "corporate") {
            trainees.push({
              username: splitted[i],
              password: splitted[i + 1],
              name: splitted[i + 2],
              email: splitted[i + 3],
              corporation: splitted[i + 5]
            })
          }
        }
        console.log(admins, instructors, trainees)
        if (admins.length === 0 && instructors.length === 0 && trainees.length === 0) {
          return notification.error({ message: "File is not accepted, please use template" })
        }
        addUsers({ admins: admins, trainees: trainees, instructors: instructors, token: auth?.token }, navigate)
      } catch (err) {
        console.log(err)
      }
    }
  }



  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          paddingBottom: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'var(--secColor)' }}>
          <AccountCircleIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Upload multiple users using .csv
        </Typography>
        <hr />
        <Button onClick={() => download(`${process.env.PUBLIC_URL}/add_user_template.csv`)} fullWidth sx={{ my: 1, ...main_button }}><DownloadIcon /> Get Template</Button>
        <Box minWidth="100%">
          <ReactFileReader handleFiles={handleFiles} fileTypes={'.csv'}>
            <Button fullWidth sx={{ my: 1, ...main_button }}><UploadIcon /> Upload .csv and Submit</Button>
          </ReactFileReader>
        </Box>
        <hr />
        <Typography component="h1" variant="h5">
          Or create a single user
        </Typography>
        <hr />
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
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
          />
          {isCorporate && (
            <MainInput
              margin="normal"
              required
              fullWidth
              name="corporation"
              label="Corporation"
              id="corporation"
            />)}
          <MainInput
            margin="normal"
            required
            fullWidth
            name="email"
            label="Email"
            type="email"
            id="email"
          />
          <FormControl sx={{ minWidth: "100%", mt: 1 }}>
            <MainInputLabel required id="type-label" title="User Type" />
            <Select
              margin="normal"
              required
              fullWidth
              autoFocus
              labelId='type-label'
              id="type"
              label="User Type"
              name="type"
              input={<StyledInput />}
            >
              <MenuItem value={"Admin"}>Admin</MenuItem>
              <MenuItem value={"Instructor"}>Instructor</MenuItem>
              <MenuItem value={"Corporate"}>Corporate Trainee</MenuItem>
            </Select>
            <FormHelperText>Choose user type to create</FormHelperText>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, ...main_button }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  auth: state?.auth
});

const mapDispatchToProps = { addUser, addUsers };

export default connect(mapStateToProps, mapDispatchToProps)(AddUsers);