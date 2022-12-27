import { Avatar, Box, Container, createTheme, CssBaseline, ThemeProvider, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import React from 'react'
import { connect } from "react-redux";
import { getTerms } from '../../app/store/actions/authActions';
import ReactMarkdown from 'react-markdown';

const Terms = ({getTerms, terms}) => {

  React.useEffect(() => {
    getTerms();
  }, [])

  return (
    <Container component="main" maxWidth="m">
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Terms&Conditions
        </Typography>

      </Box>
      <Box sx={{ mt: 1 }}>
        <Typography variant="body1" align="left">
          <ReactMarkdown children={terms}/>
        </Typography>
      </Box>
    </Container>
  )
}

const mapStateToProps = (state) => ({
  terms: state?.auth?.terms
});

const mapDispatchToProps = { getTerms };

export default connect(mapStateToProps, mapDispatchToProps)(Terms);
