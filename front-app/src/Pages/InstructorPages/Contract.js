import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Box, Card, Container, CssBaseline, Button, FormHelperText, Select, MenuItem, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { getContract, acceptContract } from '../../app/store/actions/instructorActions';
import moment from "moment";
import { centered_flex_box, main_button } from '../../app/components/Styles';

const theme = createTheme();

export const Contract = ({ auth, getContract, acceptContract, contract, isLoading }) => {

    const navigate = useNavigate()

    React.useEffect(() => {
        getContract(auth?.token)
    }, [])

    const handleResponse = () => {
        acceptContract({
            token: auth.token
        }, navigate)
    }

    if(isLoading) {
        return (
            <Box sx={{...centered_flex_box, minHeight: "100vh"}}>
                <CircularProgress sx={{color: "var(--secColor)"}}/>
            </Box>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main">
                <Box sx={{ ...centered_flex_box, minWidth: "60%" }}>
                    <Card sx={{ minWidth: "100%", padding: 3 }}>
                        <Box sx={centered_flex_box}>
                            <Typography variant="h3">{contract?.title}</Typography>
                        </Box>

                        <Typography fontWeight="bold">Terms:</Typography>
                        <Typography textAlign="justify">{contract?.body}</Typography>
                        <Typography my={2} fontWeight="bold">Platform Percentage per enrolled trainee: {contract?.percentageTaken}%</Typography>
                        <Typography fontWeight="bold" mb={1}>Status: {auth?.user?.acceptedContract ? "Accepted":"Pending"}</Typography>
                        <Box sx={centered_flex_box}>
                            {!auth?.user?.acceptedContract && <Button sx={{mx: 1, ...main_button}} onClick={handleResponse}> Accept Contract </Button>}
                            <Button sx={main_button} onClick={() => navigate(-1)}> Back </Button>
                        </Box>
                    </Card>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

const mapStateToProps = (state) => ({
    auth: state?.auth,
    contract: state?.contract?.contract,
    isLoading: state?.contract?.isLoading
});

const mapDispatchToProps = { getContract, acceptContract };

export default connect(mapStateToProps, mapDispatchToProps)(Contract);