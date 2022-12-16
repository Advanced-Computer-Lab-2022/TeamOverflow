import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import QuizIcon from '@mui/icons-material/Quiz';
import { Typography, Radio, RadioGroup, Box, Container, TextField, CssBaseline, Button, Avatar, Select, MenuItem, FormHelperText, InputLabel, FormControl } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { useParams } from 'react-router-dom';
import { getExam, submitSolution } from '../../app/store/actions/examActions';
const theme = createTheme();

export const SitExam = ({ token, getExam, submitSolution, exam }) => {

    const {courseId, exerciseId} = useParams()

    React.useEffect(() => {
        getExam({
            query: {
                courseId: courseId,
                exerciseId: exerciseId
            },
            token: token
        });
      }, [])

    const [answers, setAnswers] = React.useState(new Array(exam?.questions?.length));

    const handleAnswerChange = (value, qNo) => {
        answers[qNo] = value
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        var details = {
            solution: {
                "answers": answers,
                "exerciseId": exerciseId,
                "courseId": courseId
            },
            token: token
        }
        
        submitSolution(details);
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
                        <QuizIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Solve Exercise
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        {exam?.questions?.map((question, idx) => {
                            return (
                                <Box sx={{ mt: 1 }}>
                                    <Typography>Question {idx + 1}</Typography>
                                    <Typography>{question}</Typography>
                                    <FormControl fullWidth>
                                        <RadioGroup
                                            onChange={(event) => handleAnswerChange(event.target.value, idx)}
                                            required
                                        >
                                            {exam.choices[idx]?.map((ans, i) => ans !== null && <FormControlLabel value={i} control={<Radio />}  label={ans} />)}
                                        </RadioGroup>
                                    </FormControl>
                                    <Typography>Total Mark: {exam?.marks[idx]}</Typography>
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
                            Submit Solution
                        </Button>
                    </Box>
                </Box>

            </Container>
        </ThemeProvider >
    );
}

const mapStateToProps = (state) => ({
    user: state?.auth?.user,
    token: state?.auth?.token,
    exam: state?.exercise?.exam
});

const mapDispatchToProps = {getExam, submitSolution};

export default connect(mapStateToProps, mapDispatchToProps)(SitExam);