import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Box, Card, Container, CssBaseline, Button, FormHelperText, Select, MenuItem, TextField, TextareaAutosize, Accordion, AccordionSummary, AccordionDetails, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { NavLink, useParams } from 'react-router-dom';
import { getRegVideo, addNote } from '../../app/store/actions/videoActions';
import ReactPlayer from 'react-player'
import TextArea from 'antd/lib/input/TextArea';
import { centered_flex_box, main_button } from '../../app/components/Styles';
import moment from 'moment';

const theme = createTheme();

export const VideoView = ({ auth, getRegVideo, video, isLoading, addNote }) => {

  const params = useParams();
  const courseId = params.courseId
  const videoId = params.videoId;

  React.useEffect(() => {
    getRegVideo({
      query: {
        courseId: courseId,
        videoId: videoId
      },
      token: auth?.token
    });
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var details = {
      creation: {
        content: data.get('note'),
        timestamp: timestamp,
        videoId: videoId
      },
      token: auth.token
    }
    addNote(details);
  };

  const [timestamp, setTimestamp] = React.useState(0)
  const [noteOpen, setNoteOpen] = React.useState(false)
  const handleAddNote = (event) => {
    setTimestamp(time)
    setNoteOpen(true)
  }

  const [time, setTime] = React.useState(0);
  const handleTime = (event) => {
    setTime(event.playedSeconds.toFixed(0))
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <Card sx={{ padding: 1 }}>
          {!isLoading ? (<>
            <Box sx={centered_flex_box}>
              <Typography variant="h3">{video?.title}</Typography><br />
            </Box>
            <Box sx={centered_flex_box}>
              <ReactPlayer controls={true} onProgress={handleTime} url={video?.url} />
            </Box>
            <Accordion sx={{ m: 4 }}>
              <AccordionSummary>
                Description
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{video?.description}</Typography>
              </AccordionDetails>
            </Accordion>
            <Box sx={centered_flex_box}>
              <Button sx={main_button} onClick={handleAddNote}>Write Note Here</Button>
            </Box>
          </>) : (
            <Box sx={centered_flex_box}>
              <CircularProgress sx={{ color: "var(--secColor)" }} />
            </Box>
          )}
        </Card>
        {noteOpen && (
          <Card sx={{ my: 2, padding: 1 }}>
            <Typography>Add note at {moment().startOf('day').seconds(timestamp).format('mm:ss')}</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="note"
                label="Your Notes"
                name="note"
                autoComplete="note"
                type="text"
                autoFocus
              />
              <Box sx={centered_flex_box}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, ...main_button }}
                >
                  Add Note
                </Button>
              </Box>
            </Box>
          </Card>
        )}
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => ({
  auth: state?.auth,
  video: state?.videos?.video,
  isLoading: state?.videos?.isLoading
});

const mapDispatchToProps = { getRegVideo, addNote };

export default connect(mapStateToProps, mapDispatchToProps)(VideoView);