import * as React from 'react';
import { Typography, Box, Skeleton, Rating, Button, Chip, Grid } from '@mui/material';
import { connect } from "react-redux";
import { logout } from '../store/actions/authActions';
import { useNavigate } from 'react-router-dom';
import { Card } from '@mui/material';
import { card_style, confirm_button, left_flex_box, main_button, right_flex_box } from './Styles';
import moment from "moment"
import { acceptRefund, rejectRefund } from '../store/actions/adminActions';

function RefundsCard({ token, refund, isLoading, acceptRefund, rejectRefund }) {

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
                            Refund
                        </Typography>
                    </Grid>
                    <Grid item direction="row" alignItems="center" display="flex" justifyContent="flex-end" xs={2}>
                        <Chip sx={{ color: "var(--secColor)", borderColor: "var(--secColor)" }} label={moment(refund.createdAt).fromNow()} variant="outlined" />
                    </Grid>
                </Grid>
                <Typography>
                    {refund.traineeId.name || refund.traineeId.username} is requesting refund for "{refund.registrationId.courseId.title}" worth USD {refund.registrationId.amountPaid}
                </Typography>
                <br />
                <Box sx={{ ...left_flex_box, mt: 1 }}>
                    <Button onClick={() => acceptRefund({ info: { refundId: refund._id }, token: token })} sx={{ ...confirm_button, mx: 2 }}>
                        Accept
                    </Button>
                    <Button onClick={() => rejectRefund({ info: { refundId: refund._id }, token: token })} sx={{ ...main_button }}>
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

const mapDispatchToProps = { acceptRefund, rejectRefund };

export default connect(mapStateToProps, mapDispatchToProps)(RefundsCard);