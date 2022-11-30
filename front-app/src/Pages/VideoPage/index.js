import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Box, Card, Container, CssBaseline, Button, FormHelperText, Select, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { NavLink, useParams } from 'react-router-dom';
import { getVideo } from '../../app/store/actions/videoActions';
import ReactPlayer from 'react-player'

const theme = createTheme();

export const VideoView = ({ auth, getVideo, video }) => {

  const videoId = useParams().id

  React.useEffect(() => {
    getVideo(videoId);
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <CssBaseline />
        <Card>
          <Typography>Title: {video?.title}</Typography>
          <ReactPlayer url={video?.url} />
          <Typography>Description: {video?.description}</Typography>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => ({
  auth: state?.auth,
  video: state?.videos?.video
});

const mapDispatchToProps = { getVideo };

export default connect(mapStateToProps, mapDispatchToProps)(VideoView);