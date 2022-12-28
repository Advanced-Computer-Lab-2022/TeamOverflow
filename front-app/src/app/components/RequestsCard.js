import * as React from 'react';
import { Typography, Box, Skeleton, Rating, Button, Chip, Grid } from '@mui/material';
import { connect } from "react-redux";
import { logout } from '../store/actions/authActions';
import { useNavigate } from 'react-router-dom';
import { Card } from '@mui/material';
import { card_style, confirm_button, left_flex_box, main_button, right_flex_box } from './Styles';
import moment from "moment"
import { acceptRequest, rejectRequest } from '../store/actions/adminActions';

function RequestsCard({ token, request, isLoading, acceptRequest, rejectRequest }) {

    const navigate = useNavigate();
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
                    <Grid item xs={10}>
                        <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>
                            {request.traineeId.corporation}
                        </Typography>
                    </Grid>
                    <Grid item direction="row" alignItems="center" display="flex" justifyContent="flex-end" xs={2}>
                        <Chip sx={{ color: "var(--secColor)", borderColor: "var(--secColor)" }} label={moment(request.createdAt).fromNow()} variant="outlined" />
                    </Grid>
                </Grid>
                <Typography>
                    {request.traineeId.name || request.traineeId.username} is requesting access to "{request.courseId.title}"
                </Typography>
                <br />
                <Box sx={{ ...left_flex_box, mt: 1 }}>
                    <Button onClick={() => acceptRequest({ info: { requestId: request._id }, token: token })} sx={{ ...confirm_button, mx: 2 }}>
                        Accept
                    </Button>
                    <Button onClick={() => rejectRequest({ info: { requestId: request._id }, token: token })} sx={{ ...main_button }}>
                        Reject
                    </Button>
                </Box>

            </>)}
        </Card>
    );
}

const mapStateToProps = (state) => ({
    token: state?.auth?.token,
});

const mapDispatchToProps = { acceptRequest, rejectRequest };

export default connect(mapStateToProps, mapDispatchToProps)(RequestsCard);