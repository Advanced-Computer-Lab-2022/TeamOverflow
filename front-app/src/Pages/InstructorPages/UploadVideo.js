import * as React from 'react';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { Typography, Box, Container, TextField, CssBaseline, Button, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { uploadVideo } from '../../app/store/actions/videoActions';
import { useParams } from 'react-router-dom';

const theme = createTheme();

export const UploadVideo = ({ auth, uploadVideo }) => {

    const params = useParams().id.split("=");
    const id = params[1];

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        var details = {
            creation: {
                title: data.get('title'),
                description: data.get('description'),
                url: data.get('url'),
                subtitleId: params[0] === "subId" ? id : undefined,
                courseId: params[0] === "courseId" ? id : undefined
            },
            token: auth.token
        }
        uploadVideo(details);
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
                        Upload Video Link
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="title"
                            label="Video Title"
                            name="title"
                            autoComplete="title"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="description"
                            label="Video Description"
                            type="text"
                            id="description"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="url"
                            label="Youtube URL"
                            type="url"
                            id="url"
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

const mapDispatchToProps = { uploadVideo };

export default connect(mapStateToProps, mapDispatchToProps)(UploadVideo);