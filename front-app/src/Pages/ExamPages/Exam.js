import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import QuizIcon from '@mui/icons-material/Quiz';
import { Typography, Radio, RadioGroup, Box, Container, TextField, CssBaseline, Button, Avatar, Select, MenuItem, FormHelperText, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { getExam, submitSolution } from '../../app/store/actions/examActions';
import { centered_flex_box, left_flex_box, main_button } from '../../app/components/Styles';
const theme = createTheme();

export const SitExam = ({ token, getExam, submitSolution, exam, isLoading }) => {

    const { courseId, exerciseId } = useParams()
    const navigate = useNavigate();

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

        submitSolution(details, navigate);
    };

    if (isLoading) {
        return (
            <Box sx={{ ...centered_flex_box, minHeight: "100vh" }}>
                <CircularProgress sx={{ color: "var(--secColor)" }} />
            </Box>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main">
                <Box
                    sx={{
                        minWidth: "80%",
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'var(--secColor)' }}>
                        <QuizIcon />
                    </Avatar>
                    <Typography variant="h3">
                        Solve Exercise
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, flexDirection: 'column', minWidth: "100%", ...centered_flex_box }}>
                        {exam?.questions?.map((question, idx) => {
                            return (
                                <Box sx={{ minWidth: "100%", mt: 1 }}>
                                    <Typography fontWeight="bold">Question {idx + 1}</Typography>
                                    <Typography fontSize={24}>{question}</Typography>
                                    <FormControl>
                                        <RadioGroup
                                            onChange={(event) => handleAnswerChange(event.target.value, idx)}
                                            required
                                        >
                                            {exam.choices[idx]?.map((ans, i) => ans !== null && <FormControlLabel fontSize={20} value={i} control={<Radio />} label={ans} />)}
                                        </RadioGroup>
                                    </FormControl>
                                    <Typography fontStyle="italic">Total Mark: {exam?.marks[idx]}</Typography>
                                    <hr />
                                </Box>
                            )
                        })}
                        <Box sx={{ minWidth: "100%", ...left_flex_box }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 3, mb: 2, ...main_button }}
                            >
                                Submit Solution
                            </Button>
                        </Box>
                    </Box>
                </Box>

            </Container>
        </ThemeProvider >
    );
}

const mapStateToProps = (state) => ({
    user: state?.auth?.user,
    token: state?.auth?.token,
    exam: state?.exercise?.exam,
    isLoading: state?.exercise?.isLoading
});

const mapDispatchToProps = { getExam, submitSolution };

export default connect(mapStateToProps, mapDispatchToProps)(SitExam);