import * as React from 'react';
import StarsIcon from '@mui/icons-material/Stars';
import { Typography, Box, Container, TextField, CssBaseline, Button, Avatar, Rating } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { addUser } from '../../app/store/actions/adminActions';
import { useParams } from 'react-router-dom';

const theme = createTheme();

export const RatingPage = ({ rateInstructor, rateCourse, auth, toRate }) => {
    const { id: idToRate } = useParams();
    const [rating, setRating] = React.useState(3);
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        var details
        switch (toRate) {
            case "Instructor": {
                details = {
                    rating: rating,
                    review: data.get('review'),
                    instructorId: idToRate,
                    token: auth.token
                }
                rateInstructor(details)
                break;
            }
            case "Course": {
                details = {
                    rating: rating,
                    review: data.get('review'),
                    courseId: idToRate,
                    token: auth.token
                }
                rateCourse(details)
                break;
            }
            default: break;
        }
    };

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
                        Rate {toRate}
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

const mapDispatchToProps = { addUser };

export default connect(mapStateToProps, mapDispatchToProps)(RatingPage);