import * as React from 'react';
import { Typography, Box, Skeleton, Rating, Button, Chip, Grid } from '@mui/material';
import { connect } from "react-redux";
import { logout } from '../store/actions/authActions';
import { useNavigate } from 'react-router-dom';
import { Card } from '@mui/material';
import { card_style, main_button, right_flex_box } from './Styles';
import moment from "moment"

function ReportCard({ token, request, isLoading }) {

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
                            {request.traineeId.name} wants access to "{request.courseId.title}"
                        </Typography>
                    </Grid>
                    <Grid item direction="row" alignItems="center" display="flex" justifyContent="flex-end" xs={2}>
                        <Chip sx={{ color: "var(--secColor)", borderColor: "var(--secColor)" }} label={moment(request.createdAt).fromNow()} variant="outlined" />
                    </Grid>
                </Grid>
                <br />
                <Box sx={right_flex_box}>
                    <Button sx={{ ...main_button, mt: 2 }}>
                        Accept
                    </Button>
                </Box>

            </>)}
        </Card>
    );
}

const mapStateToProps = (state) => ({
    token: state?.auth?.token,
    isLoading: state?.reports?.isLoading
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ReportCard);