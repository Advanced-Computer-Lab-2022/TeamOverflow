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

function SubCard({ token, subtitle }) {

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
            <Typography>Video: {subtitle?.videoId ? <NavLink to={`/course/watch/${course?.course?._id}/${subtitle?.videoId._id}`}>View Subtitle Video</NavLink> : "No Video"}</Typography>
            <Typography>Exercise: {subtitle?.exerciseId ? (examsSolved.includes(subtitle?.exerciseId._id) ? <NavLink to={`/course/grade/${course?.examSolutions[examsSolved.indexOf(subtitle?.exerciseId._id)]._id}`}>Get Grade</NavLink> : <NavLink to={`/course/solve/exercise/${course?.course?._id}/${subtitle?.exerciseId._id}`}>Solve Exercise</NavLink>) : "No Exercise"}</Typography>

        </Card>
    )
}

const mapStateToProps = (state) => ({
    token: state?.auth?.token,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SubCard);