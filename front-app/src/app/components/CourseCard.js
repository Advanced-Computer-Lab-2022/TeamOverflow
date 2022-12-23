import * as React from 'react';
import { Typography, Box, Skeleton, Rating, Button, Chip, Grid } from '@mui/material';
import { connect } from "react-redux";
import { logout } from '../store/actions/authActions';
import { useNavigate } from 'react-router-dom';
import { Card } from '@mui/material';
import { card_style, main_button } from './Styles';

function CourseCard({ token, course, isLoading }) {

    const role = token.split(" ")[0];

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
                            {course.title}
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Chip sx={{ color: "var(--secColor)", borderColor: "var(--secColor)" }} label={`${course.totalHours}h`} variant="outlined" />
                    </Grid>
                </Grid>
                <Typography variant='p'>
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
                        <Grid item xs={9}>
                            <Typography sx={{ fontWeight: "bold" }}>
                                {course.currency}{course.price}
                            </Typography>
                        </Grid>
                        <Grid item xs={3} direction="row" alignItems="center" display="flex" justifyContent="flex-end">
                            <Button sx={{ ...main_button }}>
                                View Course
                            </Button>
                        </Grid>
                    </Grid>
                ) : (
                    <Button sx={{ ...main_button }}>
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