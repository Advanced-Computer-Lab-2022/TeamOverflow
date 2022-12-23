import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Rating, Card, Container, CssBaseline, Button, FormHelperText, Select, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';
import StarIcon from '@mui/icons-material/Star';
import { connect } from "react-redux";
import { Navigate, NavLink, useNavigate, useParams } from 'react-router-dom';
import moment from "moment";
import { Box } from '@mui/system';
import { getWallet } from '../../app/store/actions/authActions';

const theme = createTheme();

export const InstructorProfile = ({ user, token, wallet, getWallet }) => {

    let navigate = useNavigate();
    const routeChange = () => {
        let path = `/Instructor/edit`;
        navigate(path);
    }
    const routeChange1 = () => {
        let path = `/Instructor/editPassword`;
        navigate(path);
    }

    React.useEffect(() => {
        token && getWallet(token);
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl" >
                <CssBaseline />
                <Box display="flex" justifyContent="right" gap={"5px"} sx={{ flexDirection: "row" }}>
                    <Button onClick={routeChange} sx={{ color: "var(--secColor)" }}>Update Profile</Button>
                    <Button onClick={routeChange1} sx={{ color: "var(--secColor)" }}>Update Password</Button>
                </Box>


                <Box display="flex" justifyContent="center" marginTop={"60px"} gap="5px" color={"var(--secColor)"}>
                    <AccountCircleIcon sx={{ fontSize: 50, marginTop: 1.5 }} />
                    <Typography fontWeight={"Bold"} fontSize="50px" color={"black"} >{user?.name}</Typography>
                </Box>
                {/* <Typography>Username: {user?.username}</Typography> */}
                <Typography display="flex" justifyContent="center" color={"grey"}>{user?.bio}</Typography>

                <Box display={"flex"} sx={{ flexDirection: "column" }}>
                    <Box display="flex" justifyContent="left" gap={"5px"} color={"var(--secColor)"} sx={{ flexDirection: "row" }}>
                        <EmailIcon sx={{ fontSize: 25, marginTop: 0.5 }} />
                        <Typography color={"black"} fontSize="20px">{user?.email}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="left" gap={"5px"} color={"var(--secColor)"} sx={{ flexDirection: "row" }}>
                        <PublicIcon sx={{ fontSize: 25, marginTop: 0.5 }} />
                        <Typography color={"black"} fontSize="20px">{user?.country}</Typography>
                    </Box>


                    <Box display="flex" justifyContent="left" gap="5px">
                        <AccountBalanceWalletIcon sx={{ fontSize: 25, marginTop: 0.3, color:"var(--secColor)" }} />
                        <Typography fontSize="20px">Wallet: {wallet?.currency} {wallet?.balance}</Typography>
                    </Box>

                    <Box display="flex" justifyContent="left" gap={"10px"} color={"var(--secColor)"} sx={{ flexDirection: "row" }}>
                        <Typography fontSize={"30px"} color={"var(--secColor)"}>{user?.rating || "0.0"}</Typography>
                        <Rating
                            fullWidth
                            value={user?.rating}
                            readOnly
                            sx={{ marginTop: "10px" }}
                        />
                    </Box>


                </Box>

            </Container>
        </ThemeProvider>
    );
}

const mapStateToProps = (state) => ({
    user: state?.auth?.user,
    token: state?.auth?.token,
    wallet: state?.auth?.wallet
});

const mapDispatchToProps = { getWallet };

export default connect(mapStateToProps, mapDispatchToProps)(InstructorProfile);