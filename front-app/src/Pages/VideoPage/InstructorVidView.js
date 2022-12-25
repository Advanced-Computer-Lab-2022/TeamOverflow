import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Box, Card, Container, CircularProgress, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { getVideo } from '../../app/store/actions/videoActions';
import ReactPlayer from 'react-player'
import { centered_flex_box, left_flex_box, main_button } from '../../app/components/Styles';

const theme = createTheme();

export const VideoView = ({ auth, getVideo, video, isLoading }) => {

  const videoId = useParams().id
  const navigate = useNavigate();

  React.useEffect(() => {
    getVideo(videoId);
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <Card sx={{ padding: 1 }}>
          {!isLoading ? (<>
            <Box sx={centered_flex_box}>
              <Typography variant="h3">{video?.title}</Typography><br />
            </Box>
            <Box sx={centered_flex_box}>
              <ReactPlayer controls={true} url={video?.url} />
            </Box>
            <Accordion sx={{ my: 2 }}>
              <AccordionSummary>
              <Typography fontWeight="bold">Description</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography textAlign="justify">{video?.description}</Typography>
              </AccordionDetails>
            </Accordion>
            <Box sx={left_flex_box}>
              <Button sx={{ ...main_button, my: 1 }} onClick={() => navigate(-1)}>Back to Course</Button>
            </Box>
          </>) : (
            <Box sx={centered_flex_box}>
              <CircularProgress sx={{ color: "var(--secColor)" }} />
            </Box>
          )}
        </Card>
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => ({
  auth: state?.auth,
  video: state?.videos?.video,
  isLoading: state?.videos?.isLoading
});

const mapDispatchToProps = { getVideo };

export default connect(mapStateToProps, mapDispatchToProps)(VideoView);