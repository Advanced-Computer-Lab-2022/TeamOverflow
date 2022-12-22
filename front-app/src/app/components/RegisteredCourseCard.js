import * as React from 'react';
import { Typography, Box, Skeleton, Rating, Button, Chip, Grid, LinearProgress } from '@mui/material';
import { connect } from "react-redux";
import { logout } from '../store/actions/authActions';
import { useNavigate } from 'react-router-dom';
import { Card } from '@mui/material';
import { card_style, centered_flex_box, main_button } from './Styles';

function RegisteredCourseCard({ token, courseData, isLoading }) {

    const role = token.split(" ")[0];
    const { courseId: course, progress } = courseData
    const navigate = useNavigate()

    const reroute = (event) => {
        navigate(`/courses/student/single/${course?._id}`)
    }

    return (
        <Card sx={card_style}>
            {isLoading && (
                <Box>
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                </Box>)
            }
            {!isLoading && (<>
                <Grid container>
                    <Grid item xs={11}>
                        <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>
                            {course?.title}
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Chip sx={{ color: "var(--secColor)", borderColor: "var(--secColor)" }} label={`${course?.totalHours}h`} variant="outlined" />
                    </Grid>
                </Grid>
                <Typography variant='p'>
                    {course?.summary}
                </Typography>
                <br />
                <Rating
                    fullWidth
                    value={course?.rating}
                    readOnly
                />
                <br />
                <Button onClick={reroute} sx={{ ...main_button }}>
                    Open Course
                </Button>
                <Box sx={{my:1, color:"var(--secColor)"}}>
                    <LinearProgress sx={{bgcolor: "var(--terColor)", borderRadius: 5, height: 8}} color="inherit" variant="determinate" value={progress} />
                </Box>
            </>)}
        </Card>
    );
}

const mapStateToProps = (state) => ({
    token: state?.auth?.token,
    isLoading: state?.courses?.isLoading
});

const mapDispatchToProps = { logout };

export default connect(mapStateToProps, mapDispatchToProps)(RegisteredCourseCard);