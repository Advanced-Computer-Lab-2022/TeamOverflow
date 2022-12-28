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
import { viewExam } from '../../app/store/actions/examActions';
import { centered_flex_box, left_flex_box, main_button } from '../../app/components/Styles';
const theme = createTheme();

export const ViewExam = ({ token, viewExam, exercise, isLoading }) => {

    const { id: exerciseId } = useParams()
    const navigate = useNavigate();

    React.useEffect(() => {
        viewExam({
            query: {
                exerciseId: exerciseId
            },
            token: token
        });
    }, [])

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
                        Total Grade: {exercise?.marks.reduce((i,j) => i+j)}
                    </Typography>
                    <Box component="form" sx={{ mt: 1, minWidth: "100%", flexDirection: "column", ...centered_flex_box }}>
                        {exercise?.questions?.map((question, idx) => {
                            return (
                                <Box sx={{ minWidth: "100%", mt: 1 }}>
                                    <Typography fontWeight="bold">Question {idx + 1}</Typography>
                                    <Typography fontSize={24}>{question}</Typography>
                                    <FormControl fullWidth>
                                        <RadioGroup
                                            value={exercise?.correctIndecies[idx]}
                                        >
                                            {exercise?.choices[idx]?.map((ans, i) => ans !== null && <FormControlLabel value={i} control={<Radio color={'success'} />} label={ans} />)}
                                        </RadioGroup>
                                    </FormControl>
                                    <Typography fontStyle="italic">Question Mark: {exercise?.marks[idx]}</Typography>
                                    <hr />
                                </Box>
                            )
                        })}
                        <Box sx={{ minWidth: "100%", ...left_flex_box }}>
                            <Button
                                variant="contained"
                                onClick={() => navigate(-1)}
                                sx={{ mt: 3, mb: 2, ...main_button }}
                            >
                                Back to course
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
    exercise: state?.exercise?.exam,
    isLoading: state?.exercise?.isLoading
});

const mapDispatchToProps = { viewExam }
export default connect(mapStateToProps, mapDispatchToProps)(ViewExam);