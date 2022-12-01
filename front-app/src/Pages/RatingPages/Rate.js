import * as React from 'react';
import StarsIcon from '@mui/icons-material/Stars';
import { Typography, Box, Container, TextField, CssBaseline, Button, Avatar, Rating } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { useParams } from 'react-router-dom';
import { postRating } from '../../app/store/actions/ratingActions';

const theme = createTheme();

export const AddRating = ({ postRating, auth }) => {

    const params = useParams().id.split("=");
    const id = params[1];

    const [rating, setRating] = React.useState(3);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        var details = {
            creation: {
                rating: rating,
                review: data.get('review'),
                instructorId: params[0] === "instructorId" ? id : undefined,
                courseId: params[0] === "courseId" ? id : undefined
            },
            token: auth.token
        }
        postRating(details)
    }

return (
    <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <StarsIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Post a rating
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Typography component="legend">Rating</Typography>
                    <Rating
                        fullWidth
                        name="simple-controlled"
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="review"
                        label="Review"
                        type="text"
                        id="review"
                        minRows={8}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
        </Container>
    </ThemeProvider>
);
}

const mapStateToProps = (state) => ({
    auth: state?.auth
});

const mapDispatchToProps = { postRating };

export default connect(mapStateToProps, mapDispatchToProps)(AddRating);