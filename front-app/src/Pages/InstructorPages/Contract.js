import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Box, Card, Container, CssBaseline, Button, FormHelperText, Select, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { NavLink, useParams } from 'react-router-dom';
import { getContract, contractResponse } from '../../app/store/actions/instructorActions';
import moment from "moment";

const theme = createTheme();

export const Contract = ({ auth, getContract, contractResponse, contract }) => {

    React.useEffect(() => {
        getContract(auth?.token)
    }, [])

    const handleResponse = (res) => {
        contractResponse({
            edits: {
                response: res,
                contractId: contract._id
            },
            token: auth.token
        })
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl">
                <CssBaseline />
                <Typography>Title: {contract?.title}</Typography>
                <Typography>Terms: {contract?.terms}</Typography>
                <Typography>Percentage on each video per trainee: {contract?.percentageTaken}</Typography>
                <Typography>Status: {contract?.status}</Typography>
                {
                    contract?.status === "Pending" && <><Button onClick={() => handleResponse("Accepted")}> Accept </Button><Button onClick={() => handleResponse("Rejected")}> Reject </Button></>
                }
            </Container>
        </ThemeProvider>
    );
}

const mapStateToProps = (state) => ({
    auth: state?.auth,
    contract: state?.contract?.contract
});

const mapDispatchToProps = { getContract, contractResponse };

export default connect(mapStateToProps, mapDispatchToProps)(Contract);