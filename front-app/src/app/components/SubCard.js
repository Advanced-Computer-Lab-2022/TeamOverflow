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
import { NavLink } from 'react-router-dom';

function SubCard({ token, subtitle, course, examsSolved, examSolutions }) {

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
            {subtitle?.videoId &&
                <Button onClick={() => navigate(`/course/watch/${course?._id}/${subtitle?.videoId._id}`)} sx={{ ...main_button, mt: 2, mr: 2 }}>
                    <OndemandVideoIcon /> Watch Subtitle Video
                </Button>
            }
            {
                subtitle?.exerciseId ? (examsSolved?.includes(subtitle?.exerciseId._id) ? (
                    <Button onClick={() => navigate(`/course/grade/${examSolutions[examsSolved?.indexOf(subtitle?.exerciseId._id)]._id}`)} sx={{ ...main_button, mt: 2, mr: 2 }}>
                        <VisibilityIcon /> View Exercise Grade
                    </Button>
                ) : (
                    <Button onClick={() => navigate(`/course/solve/exercise/${course?._id}/${subtitle?.exerciseId._id}`)} sx={{ ...main_button, mt: 2, mr: 2 }}>
                        <QuizIcon /> Solve Exercise
                    </Button>
                )
                ) : (
                    <></>
                )
            }
        </Card >
    )
}

const mapStateToProps = (state) => ({
    token: state?.auth?.token,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SubCard);