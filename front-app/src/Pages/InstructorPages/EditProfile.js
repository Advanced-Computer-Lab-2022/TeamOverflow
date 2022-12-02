import * as React from 'react';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { Typography, Box, Container, TextField, CssBaseline, Button, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { editProfile } from '../../app/store/actions/instructorActions';
import { useParams } from 'react-router-dom';

const theme = createTheme();

export const EditProfile = ({ auth, editProfile }) => {

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        var details = {
            edits: {
                email: data.get('email'),
                bio: data.get('bio'),
            },
            token: auth.token
        }
        editProfile(details);
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
                        <OndemandVideoIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Update Bio/Email
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="bio"
                            label="Mini Biography"
                            name="bio"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="email"
                            label="Email"
                            type="email"
                            id="email"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Upload
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

const mapDispatchToProps = { editProfile };

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);