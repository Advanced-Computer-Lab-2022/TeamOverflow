import * as React from 'react';
import { Typography, Box, Skeleton, Rating, Button, Chip, Grid } from '@mui/material';
import { connect } from "react-redux";
import { logout } from '../store/actions/authActions';
import { useNavigate } from 'react-router-dom';
import { Card } from '@mui/material';
import { card_style, main_button } from './Styles';
import moment from "moment"

function CourseCard({ token, course, isLoading, rank }) {

    const role = token.split(" ")[0];
    const navigate = useNavigate();

    const reroute = () => {
        navigate(`/courses/preview/${course._id}`)
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
                            {rank ? `#${rank}. `:""}{course.title}
                        </Typography>
                    </Grid>
                    <Grid item direction="row" alignItems="center" display="flex" justifyContent="flex-end" xs={2}>
                        {/* {rank && <Chip sx={{ color: "green", borderColor: "green", mx: 1, fontWeight: "bold" }} label={`#${rank}`} variant="outlined" />} */}
                        {role !== "Corporate" && course?.deadline && course?.startDate && moment().isBefore(course?.deadline) && moment().isAfter(course?.startDate) && <Chip sx={{ mx: 1, color: "green", borderColor: "green", fontWeight: "bold" }} label={`${course?.discount}% SALE`} variant="outlined" />}
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
                />
                <br />
                {role !== "Corporate" ? (
                    <Grid container >
                        <Grid item xs={3} direction="row" alignItems="center" display="flex" justifyContent="flex-start">
                            <Button onClick={reroute} sx={{ ...main_button }}>
                                View Course
                            </Button>
                        </Grid>
                        <Grid item xs={9} display="flex" justifyContent="flex-end">
                            {
                                (course?.deadline && course?.startDate && moment().isBefore(course?.deadline) && moment().isAfter(course?.startDate)) ? (
                                    <Box>
                                        <Typography sx={{ textDecoration: "line-through", color: "red", fontWeight: "bold" }}>{course?.currency} {course?.price}</Typography>
                                        <Typography sx={{ color: "green", fontWeight: "bold" }}>{course?.currency} {(course?.price * ((100 - course?.discount) / 100)).toFixed(2)}</Typography>
                                    </Box>
                                ) : (
                                    <Typography sx={{ fontWeight: "bold" }}>{course?.currency} {course?.price}</Typography>
                                )
                            }
                        </Grid>
                    </Grid>
                ) : (
                    <Button onClick={reroute} sx={{ ...main_button }}>
                        View Course
                    </Button>
                )}
            </>)}
        </Card>
    );
}

const mapStateToProps = (state) => ({
    token: state?.auth?.token,
    isLoading: state?.courses?.isLoading
});

const mapDispatchToProps = { logout };

export default connect(mapStateToProps, mapDispatchToProps)(CourseCard);