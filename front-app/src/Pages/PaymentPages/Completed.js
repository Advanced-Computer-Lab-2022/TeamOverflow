import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Box, Container, TextField, CssBaseline, Button, Avatar, Select, MenuItem, FormHelperText, InputLabel } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { LoginUser, guestVisit } from '../../app/store/actions/authActions';
import { Navigate, NavLink, Route, Routes, useParams } from "react-router-dom";

const theme = createTheme();

export const PaymentDone = () => {

    const {status, courseId} = useParams()

    return (
        <></>
    )
}

const mapStateToProps = (state) => ({
    user: state?.auth?.user,
    token: state?.auth?.token
});

const mapDispatchToProps = { LoginUser, guestVisit };

export default connect(mapStateToProps, mapDispatchToProps)(PaymentDone);