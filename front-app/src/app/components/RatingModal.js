import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Avatar, Card, Rating } from '@mui/material';
import { centered_flex_box, confirm_button, MainTextArea, main_button } from './Styles';
import Stars from '@mui/icons-material/Stars';

export default function RatingModal({ message, open, handleClose, action }) {

    const [rating, setRating] = React.useState(3);

    return (

        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={{ ...centered_flex_box, minHeight: "100vh"}}>
                <Card sx={{ display: "flex", p: 3, flexDirection: "column", minWidth: "30vw"  }}>
                    <Box sx={{ ...centered_flex_box, mb: 1 }}>
                        <Typography variant='h4'>Rate {message}</Typography>
                    </Box>
                    <Box value={rating} onSubmit={action} sx={{ ...centered_flex_box, mb: 1, flexDirection: "column" }} component="form" >
                        <Avatar sx={{ m: 1, bgcolor: 'var(--secColor)' }}>
                            <Stars />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Post a rating
                        </Typography>
                        <Rating
                            fullWidth
                            size='large'
                            name="simple-controlled"
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                        />
                        <MainTextArea
                            margin="normal"
                            fullWidth
                            name="review"
                            label="Review"
                            type="text"
                            id="review"
                            minRows={8}
                        />
                        <Box sx={{ ...centered_flex_box, mt: 1 }}>
                            <Button type="submit" sx={{ ...confirm_button, mx: 2 }}>Confirm</Button>
                            <Button onClick={handleClose} sx={main_button}>Cancel</Button>
                        </Box>
                    </Box>
                </Card>
            </Box>
        </Modal >
    );
}