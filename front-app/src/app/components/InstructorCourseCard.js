import * as React from 'react';
import { Typography, Box, Skeleton, Rating, Button, Chip, Grid } from '@mui/material';
import { connect } from "react-redux";
import { logout } from '../store/actions/authActions';
import { useNavigate } from 'react-router-dom';
import { Card } from '@mui/material';
import { card_style, main_button } from './Styles';
import moment from "moment"
import Stars from '@mui/icons-material/Stars';
import Visibility from '@mui/icons-material/Visibility';

function InstructorCourseCard({ token, course, isLoading }) {

    const navigate = useNavigate();

    const reroute = () => {
        navigate(`/courses/instructor/single/${course._id}`)
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
                    <Grid item xs={10}>
                        <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>
                            {course.title}
                        </Typography>
                    </Grid>
                    <Grid item direction="row" alignItems="center" display="flex" justifyContent="flex-end" xs={2}>
                        {course?.deadline && moment().isBefore(course?.deadline) && <Chip sx={{ mx: 1, color: "green", borderColor: "green" }} label={`${course?.discount}%`} variant="outlined" />}
                        <Chip sx={{ color: "var(--secColor)", borderColor: "var(--secColor)" }} label={`${course.totalHours}h`} variant="outlined" />
                    </Grid>
                </Grid>
                <Typography variant='p' sx={{
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                }}>
                    {course.summary}
                </Typography>
                <br />
                <Rating
                    fullWidth
                    value={course.rating}
                    readOnly
                    size='large'
                />
                <br />
                <Grid container >
                    <Grid item xs={4}>
                        {
                            (course?.deadline && moment().isBefore(course?.deadline)) ? (
                                <>
                                    <Typography sx={{ textDecoration: "line-through", color: "red", fontWeight: "bold" }}>{course?.currency} {course?.price}</Typography>
                                    <Typography sx={{ color: "green", fontWeight: "bold" }}>{course?.currency} {(course?.price * ((100 - course?.discount) / 100)).toFixed(2)}</Typography>
                                </>
                            ) : (
                                <Typography sx={{ fontWeight: "bold" }}>{course?.currency} {course?.price}</Typography>
                            )
                        }
                    </Grid>
                    <Grid item xs={8} direction="row" alignItems="center" display="flex" justifyContent="flex-end">
                        <Button disabled={course?.numberOfRatings === 0} onClick={() => navigate(`/courses/ratings/${course?._id}`)} sx={{ ...main_button, mr: 1 }}>
                            <Stars /> View Ratings
                        </Button>
                        <Button onClick={reroute} sx={{ ...main_button }}>
                            <Visibility /> View Course
                        </Button>
                    </Grid>
                </Grid>
            </>)}
        </Card>
    );
}

const mapStateToProps = (state) => ({
    token: state?.auth?.token,
    isLoading: state?.courses?.isLoading
});

const mapDispatchToProps = { logout };

export default connect(mapStateToProps, mapDispatchToProps)(InstructorCourseCard);