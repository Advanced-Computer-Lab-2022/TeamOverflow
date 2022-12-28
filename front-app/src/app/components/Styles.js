import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import TextArea from 'antd/lib/input/TextArea';
import { Select } from '@mui/material';
import InputBase from '@mui/material/InputBase';

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

export const sec_button = {
    color: "var(--secColor)",
    bgcolor: "var(--primaryColor)",
    ":hover": {
        color: "var(--mainWhite)",
        bgcolor: "var(--terColor)"
    },
    ":disabled": {
        color: "var(--mainWhite)",
        bgcolor: "gray"
    }
}

export const card_style = {
    minWidth: "40vw",
    maxWidth: "40vw",
    padding: 2,
    marginY: 2,
    marginX:2,
    ":hover": {
        "transition-duration": "0.5s",
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

export const right_flex_box = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start"
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
            border: '1px solid var(--secColor)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'var(--terColor)',
        },
    },
});



export const StyledInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        border: "1px solid",
        borderColor: "var(--secColor)",
        position: 'relative',
        fontSize: 16,
        padding: 16,
        '&:focus': {
            borderColor: 'var(--terColor)',
        },
    },
}));

export const MainTextArea = ({ name, autoComplete, autoFocus, label, id, required }) => {
    return (<>
        <InputLabel sx={{ color: 'black' }}>{label}</InputLabel>
        <TextArea name={name} autoComplete={autoComplete} autoFocus={autoFocus} id={id} aria-label={label} required={required} style={{ borderColor: "var(--secColor)", borderRadius: 4, fontFamily: "sans-serif", backgroundColor: "var(--mainWhite)" }} />
    </>)
}

export const MainInputLabel = ({ required, id, title}) => {
    return <InputLabel required={required} sx={{ bgcolor: "var(--mainWhite)" }} variant='outlined' id={id}>{title}</InputLabel>
}
