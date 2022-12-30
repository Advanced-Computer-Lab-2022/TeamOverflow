import * as React from 'react';
import { Typography, Box, Skeleton, Rating, Button, Chip, Grid } from '@mui/material';
import { connect } from "react-redux";
import { logout } from '../store/actions/authActions';
import { useNavigate } from 'react-router-dom';
import { Card } from '@mui/material';
import { card_style, left_flex_box, main_button } from './Styles';
import moment from "moment"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function ReviewCard({ token, rating }) {

    const role = token.split(" ")[0];
    const navigate = useNavigate();

    return (
        <Card sx={card_style}>
            <Box >
                <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>
                    {rating?.courseId?.title || rating?.instructorId?.name || "User Rating"}
                </Typography>
                <Rating size='large' value={rating?.rating} readOnly />
                <Typography variant='p' sx={{
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                }}>
                    {rating?.review || "No Review"}
                </Typography>
            </Box>
            <Box sx={{ ...left_flex_box, mt: 1 }}>
                <Button disabled={rating?.review?.length < 255} sx={{ ...main_button }}>
                    <MoreHorizIcon/> See More
                </Button>
            </Box>
        </Card>
    );
}

const mapStateToProps = (state) => ({
    token: state?.auth?.token,
    isLoading: state?.courses?.isLoading
});

const mapDispatchToProps = { logout };

export default connect(mapStateToProps, mapDispatchToProps)(ReviewCard);