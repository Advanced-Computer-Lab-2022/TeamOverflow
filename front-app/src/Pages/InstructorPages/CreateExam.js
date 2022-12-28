import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import QuizIcon from '@mui/icons-material/Quiz';
import { Typography, Radio, RadioGroup, Box, Container, TextField, CssBaseline, Button, Avatar, Select, MenuItem, FormHelperText, InputLabel, FormControl } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { createExercise } from '../../app/store/actions/instructorActions';
import { main_button } from '../../app/components/Styles';
const theme = createTheme();

export const CreateExam = ({ token, createExercise }) => {

    const params = useParams().id.split("=");
    const id = params[1];
    const navigate = useNavigate();

    const [subForm, setSubForm] = React.useState([""]);
    const [questions, setQuestions] = React.useState([]);
    const [options, setOptions] = React.useState([[null,null,null,null]]);
    const [correct, setCorrect] = React.useState([]);
    const [marks, setMarks] = React.useState([]);

    const handleQuestionCountChange = (event) => {
        setSubForm(new Array(event.target.value).fill(""));
        setQuestions(new Array(event.target.value));
        setCorrect(new Array(event.target.value));
        setMarks(new Array(event.target.value));

        var temp = new Array(event.target.value)
        for(let i=0; i<event.target.value; i++){
            temp[i] = [null,null,null,null]
        }
        setOptions(temp);
    }

    const handleIndexChange = (value, qNo) => {
        correct[qNo] = parseInt(value)
    }

    const handleMarksChange = (value, qNo) => {
        marks[qNo] = parseInt(value)
    }

    const handleOptionChange = (value, qNo, opNo) => {
        options[qNo][opNo] = value
    }

    const handleQuestionChange = (value, qNo) => {
        questions[qNo] = value
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        var details
        if(params[0] === "courseId"){
            details = {
                creation: {
                    questions: questions,
                    choices: options,
                    correctIndecies: correct,
                    marks: marks,
                    courseId: id
                },
                token: token
            }
        } else {
            details = {
                creation: {
                    questions: questions,
                    choices: options,
                    correctIndecies: correct,
                    marks: marks,
                    subtitleId: id
                },
                token: token
            }
        }
        createExercise(details, navigate);
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
                    <Avatar sx={{ m: 1, bgcolor: 'var(--secColor)'}}>
                        <QuizIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Create Exercise
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <Select
                            label="Question Count"
                            id="Subject"
                            name="subj"
                            onChange={handleQuestionCountChange}
                            fullWidth
                            defaultValue={1}
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={7}>7</MenuItem>
                            <MenuItem value={8}>8</MenuItem>
                            <MenuItem value={9}>9</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                        </Select>
                        <FormHelperText>Number of Questions</FormHelperText>
                        <hr />
                        {subForm.map((c, idx) => {
                            return (
                                <Box sx={{ mt: 1 }}>
                                    <Typography>Question {idx + 1}</Typography>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id={`question${idx}`}
                                        label="Question Head"
                                        name={`question${idx}`}
                                        value={questions[idx]}
                                        autoFocus
                                        onChange={(event) => handleQuestionChange(event.target.value, idx)}
                                    />
                                    <FormControl fullWidth>
                                        <RadioGroup
                                            onChange={(event) => handleIndexChange(event.target.value, idx)}
                                            value={correct[idx]}
                                        >
                                            <FormControlLabel value={0} control={<Radio />}  label={<TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="option1"
                                                label="Option 1"
                                                name="option1"
                                                autoFocus
                                                value={options[idx][0]}
                                                onChange={(event) => handleOptionChange(event.target.value, idx, 0)}
                                            />} />
                                            <FormControlLabel value={1} control={<Radio />} label={<TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="option2"
                                                label="Option 2"
                                                name="option2"
                                                autoFocus
                                                value={options[idx][1]}
                                                onChange={(event) => handleOptionChange(event.target.value, idx, 1)}
                                            />} />
                                            <FormControlLabel value={2} control={<Radio />} label={<TextField
                                                margin="normal"
                                                fullWidth
                                                id="option3"
                                                label="Option 3"
                                                name="option3"
                                                autoFocus
                                                value={options[idx][2]}
                                                onChange={(event) => handleOptionChange(event.target.value, idx, 2)}
                                            />} />
                                            <FormControlLabel value={3} control={<Radio />} label={<TextField
                                                margin="normal"
                                                fullWidth
                                                id="option4"
                                                label="Option 4"
                                                name="option4"
                                                autoFocus
                                                value={options[idx][4]}
                                                onChange={(event) => handleOptionChange(event.target.value, idx, 3)}
                                            />} />
                                        </RadioGroup>
                                    </FormControl>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name={`marks${idx}`}
                                        label="Marks"
                                        id={`marks${idx}`}
                                        type="number"
                                        value={marks[idx]}
                                        inputProps={{min:1}}
                                        onChange={(event) => handleMarksChange(event.target.value, idx)}
                                    />
                                    <hr />
                                </Box>
                            )
                        })}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, ...main_button }}
                        >
                            Create
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
});

const mapDispatchToProps = {createExercise};

export default connect(mapStateToProps, mapDispatchToProps)(CreateExam);