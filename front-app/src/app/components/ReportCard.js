import * as React from 'react';
import { Typography, Box, Skeleton, Rating, Button, Chip, Grid } from '@mui/material';
import { connect } from "react-redux";
import { logout } from '../store/actions/authActions';
import { useNavigate } from 'react-router-dom';
import { Card } from '@mui/material';
import { card_style, main_button } from './Styles';
import moment from "moment"

function ReportCard({ token, report, isLoading }) {

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
                            {report.type}
                        </Typography>
                    </Grid>
                    <Grid item direction="row" alignItems="center" display="flex" justifyContent="flex-end" xs={2}>
                        <Chip sx={{ color: "var(--secColor)", borderColor: "var(--secColor)" }} label={report.status} variant="outlined" />
                    </Grid>
                </Grid>
                <Typography variant='p' sx={{
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                }}>
                    {report.details}
                </Typography>
                <br />
                <Button onClick={() => navigate(`/reports/single/${report._id}`)} sx={{ ...main_button, mt:2}}>
                    View Reported Problem
                </Button>
                {role !== "Admin" && report.status !== "Resolved" && (
                    <Button onClick={() => navigate(`/reports/followup/${report._id}`)} sx={{ ...main_button, mx: 1, mt:2 }}>
                        Follow Up
                    </Button>
                )}
            </>)}
        </Card>
    );
}

const mapStateToProps = (state) => ({
    token: state?.auth?.token,
    isLoading: state?.reports?.isLoading
});

const mapDispatchToProps = { };

export default connect(mapStateToProps, mapDispatchToProps)(ReportCard);