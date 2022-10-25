import * as React from 'react';
import {Container, CssBaseline} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { Outlet } from 'react-router-dom';
import { logout } from '../../app/store/actions/authActions';

const theme = createTheme();

export const Wrapper = ({}) => {

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <CssBaseline/>
        <Outlet/>
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => ({
    auth: state?.auth
});

const mapDispatchToProps = {logout};

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);