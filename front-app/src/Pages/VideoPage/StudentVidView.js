import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import DownloadIcon from '@mui/icons-material/Download';
import CreateIcon from '@mui/icons-material/Create';
import { Typography, Box, Card, Container, CssBaseline, Button, InputBase, FormHelperText, Select, MenuItem, TextField, TextareaAutosize, Accordion, AccordionSummary, AccordionDetails, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { getRegVideo, addNote, downloadNotes } from '../../app/store/actions/videoActions';
import ReactPlayer from 'react-player/youtube'
import TextArea from 'antd/lib/input/TextArea';
import { centered_flex_box, left_flex_box, MainInput, MainTextArea, main_button, right_flex_box } from '../../app/components/Styles';
import moment from 'moment';
import ExpandMore from '@mui/icons-material/ExpandMore';

const theme = createTheme();

export const VideoView = ({ auth, getRegVideo, video, isLoading, addNote, downloadNotes }) => {

  const params = useParams();
  const courseId = params.courseId
  const videoId = params.videoId;

  const navigate = useNavigate();

  const [timestamp, setTimestamp] = React.useState(0)
  const [noteOpen, setNoteOpen] = React.useState(false)

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
    setNoteOpen(false);
  };

  const handleAddNote = (event) => {
    setTimestamp(time)
    setNoteOpen(!noteOpen)
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
            <Box sx={{ ...centered_flex_box, mb: 2 }}>
              <Typography variant="h3">{video?.title}</Typography><br />
            </Box>
            <Box sx={centered_flex_box}>
              <ReactPlayer controls={true} onProgress={handleTime} url={video?.url} />
            </Box>
            <Accordion sx={{ my: 4 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography fontWeight="bold">Description</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography textAlign="justify">{video?.description}</Typography>
              </AccordionDetails>
            </Accordion>

            <Grid container justifyContent="space-between">
              <Grid item sx={left_flex_box}>
                <Button sx={{ ...main_button }} onClick={() => navigate(`/courses/student/single/${courseId}`)}>Back to Course</Button>
              </Grid>
              <Grid item sx={right_flex_box}>
                <Button sx={{ ...main_button }} onClick={handleAddNote}>{!noteOpen ? (<><CreateIcon /> Write Note</>) : "Close Note"}</Button>
                <Button sx={{ ...main_button, ml: 2 }} onClick={() => downloadNotes({ videoId: videoId, token: auth?.token })}><DownloadIcon />Download Notes</Button>
              </Grid>
            </Grid>

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
              <MainTextArea
                required
                id="note"
                label="Your Notes"
                name="note"
                autoComplete="note"
                type="text"
                autoFocus
              />
              <Box sx={left_flex_box}>
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

const mapDispatchToProps = { getRegVideo, addNote, downloadNotes };

export default connect(mapStateToProps, mapDispatchToProps)(VideoView);