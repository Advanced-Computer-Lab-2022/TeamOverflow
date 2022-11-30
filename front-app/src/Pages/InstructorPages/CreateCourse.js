import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Box, Container, TextField, CssBaseline, Button, Avatar, Select, MenuItem, FormHelperText, InputLabel } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { createCourse } from '../../app/store/actions/instructorActions';
import { getSubjects } from '../../app/store/actions/coursesActions';

const theme = createTheme();

export const CreateCourse = ({ token, createCourse, subjects, getSubjects }) => {
    React.useEffect(() => {
        getSubjects()
    }, [])

    const [subject, setSubject] = React.useState(null)

    const [subtitleCount, setSubtitleCount] = React.useState(1);
    const [subForms, setSubForms] = React.useState([" "]);

    const handleSubtitleChange = (event) => {
        setSubtitleCount(event.target.value);
        setSubForms(new Array(event.target.value).fill(" "));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        var subtitles = [];
        const data = new FormData(event.currentTarget);
        for(let i=0; i<subtitleCount; i++){
            var sub = {
                title: data.get(`title${i}`),
                time: data.get(`time${i}`)
            }
            subtitles.push(sub);
        }
        var details = {
            creation: {
                title: data.get("title"),
                subject: subject,
                summary: data.get("summary"),
                price: data.get("price"),
                subtitles: subtitles
            },
            token: token
        }
        createCourse(details)
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
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Add Course
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="title"
                            label="Course Title"
                            name="title"
                            autoFocus
                        />
                        <Select
                            label="Subject"
                            id="Subject"
                            name="subj"
                            onChange={(event) => setSubject(event.target.value)}
                            fullWidth
                        >
                            {subjects?.map((subject, i) => {
                                return (
                                    <MenuItem key={i} value={subject}>
                                        {subject}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                        <FormHelperText>Select course subject</FormHelperText>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="summary"
                            label="Course Summary"
                            id="summary"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="price"
                            label="Course Price (USD)"
                            id="price"
                            type="number"
                        />
                        <Select
                            label="Subject"
                            id="Subject"
                            name="subj"
                            onChange={handleSubtitleChange}
                            fullWidth
                            defaultValue={1}
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                        </Select>
                        <FormHelperText>Number of Subtitles</FormHelperText>
                        <hr />
                        {subForms.map((c, idx) => {
                            return (
                                <Box sx={{ mt: 1 }}>
                                    <Typography>Subtitle {idx + 1}</Typography>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id={`title${idx}`}
                                        label="Subtitle Title"
                                        name={`title${idx}`}
                                        autoFocus
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name={`time${idx}`}
                                        label="Subtitle Time"
                                        id={`time${idx}`}
                                        type="number"
                                    />
                                    <hr />
                                </Box>
                            )
                        })}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Create
                        </Button>
                    </Box>
                </Box>

            </Container>
        </ThemeProvider>
    );
}

const mapStateToProps = (state) => ({
    user: state?.auth?.user,
    token: state?.auth?.token,
    subjects: state?.courses?.subjects
});

const mapDispatchToProps = { createCourse, getSubjects };

export default connect(mapStateToProps, mapDispatchToProps)(CreateCourse);