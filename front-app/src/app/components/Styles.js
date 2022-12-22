import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import TextArea from 'antd/lib/input/TextArea';

export const main_button = {
    color: "var(--primaryColor)",
    bgcolor: "var(--secColor)",
    ":hover": {
        color: "var(--secColor)",
        bgcolor: "var(--terColor)"
    },
    ":disabled": {
        color: "var(--mainWhite)",
        bgcolor: "gray"
    }
}

export const card_style = {
    minWidth: "40vw",
    padding: 2,
    marginX: "30vw",
    marginY: 2,
    ":hover": {
        "transition-duration": "1s",
        "box-shadow": "0px 10px 5px 0px rgba(231,129,132,0.75)",
        "-webkit-box-shadow": "0px 10px 5px 0px rgba(231,129,132,0.75)",
        "-moz-box-shadow": "0px 10px 5px 0px rgba(231,129,132,0.75)"
    }
}

export const centered_flex_box = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
}

export const left_flex_box = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end"
}

export const MainInput = styled(TextField)({
    '& label.Mui-focused': {
        color: 'var(--secColor)',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'green',
    },
    '& .MuiInputBase-input': {
        outerHeight: 500
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'var(--secColor)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'var(--terColor)',
        },
    },
});

export const MainTextArea = ({ name, autoComplete, autoFocus, label, id, required }) => {
    return (<>
        <InputLabel sx={{color: 'black'}}>{label}</InputLabel>
        <TextArea name={name} autoComplete={autoComplete} autoFocus={autoFocus} id={id} aria-label={label} required={required} style={{ borderColor: "var(--secColor)", borderRadius: 4, fontFamily: "sans-serif" }} />
    </>)
}