import * as React from 'react';
import { Typography, Box, Skeleton, Rating, Button, Chip, Grid } from '@mui/material';
import { connect } from "react-redux";
import VisibilityIcon from '@mui/icons-material/Visibility';
import QuizIcon from '@mui/icons-material/Quiz';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { useNavigate } from 'react-router-dom';
import { Card } from '@mui/material';
import { card_style, main_button } from './Styles';
import moment from "moment"

function SubtitleCard({ token, subtitle }) {

    const navigate = useNavigate();
    const role = token.split(" ")[0];

    return (
        <Card sx={card_style}>
            <Grid container>
                <Grid item xs={10}>
                    <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>
                        {subtitle.title}
                    </Typography>
                </Grid>
                <Grid item direction="row" alignItems="center" display="flex" justifyContent="flex-end" xs={2}>
                    <Chip sx={{ color: "var(--secColor)", borderColor: "var(--secColor)" }} label={`${subtitle.time}h`} variant="outlined" />
                </Grid>
            </Grid>
            <br />
            <Box display="flex" justifyContent="flex-start">
                {subtitle?.videoId ? (
                    <Button onClick={() => navigate(`/course/video/${subtitle?.videoId}`)} sx={{ ...main_button, mt: 2, mr:2 }}>
                        <VisibilityIcon/> View Subtitle Video
                    </Button>
                ) : (
                    <Button onClick={() => navigate(`/course/video/upload/subId=${subtitle?._id}`)} sx={{ ...main_button, mt: 2, mr:2 }}>
                        <OndemandVideoIcon /> Add Subtitle Video
                    </Button>
                )
                }
                {subtitle?.exerciseId ? (
                    <Button onClick={() => navigate(`/course/exercise/view/${subtitle?.exerciseId}`)} sx={{ ...main_button, mt: 2, mr:2 }}>
                        <VisibilityIcon/> View Subtitle Exercise
                    </Button>
                ) : (
                    <Button onClick={() => navigate(`/course/exercise/create/subId=${subtitle?._id}`)} sx={{ ...main_button, mt: 2, mr:2 }}>
                        <QuizIcon /> Add Subtitle Exercise
                    </Button>
                )
                }
            </Box>
        </Card>
    )
}

const mapStateToProps = (state) => ({
    token: state?.auth?.token,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SubtitleCard);