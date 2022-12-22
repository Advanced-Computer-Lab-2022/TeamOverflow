import * as React from 'react';
import { Typography, Container, CssBaseline, Button, Chip, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { connect } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';

const theme = createTheme();

export const TraineeProfile = ({ user, getWallet, token }) => {

    const role = token.split(" ")[0];

    let navigate = useNavigate();
    const routeChange = () => {
        let path = `/Trainee/edit`;
        navigate(path);
    }
    const routeChange1 = () => {
        let path = `/Trainee/editPassword`;
        navigate(path);
    }

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <Box display="flex" justifyContent="right" gap={"5px"} sx={{ flexDirection: "row" }}>
                    <Button onClick={routeChange} sx={{ color: "var(--secColor)" }}>Update Profile</Button>
                    <Button onClick={routeChange1} sx={{ color: "var(--secColor)" }}>Change Password</Button>

                </Box>

                <Box sx={{ background: 'linear-gradient(to right, var(--secColor), var(--primaryColor))', maxHeight: 180, borderRadius: 2 }}>
                    <AccountCircleIcon sx={{ fontSize: 200, color: 'black', opacity: 1, mt: 8 }} />
                </Box>
                <Typography fontWeight={"Bold"} fontSize="50px" color={"black"} align='center'>{user?.name}</Typography>

                <Box display={"flex"} sx={{ flexDirection: "row" }}>
                    <Box display={"flex"} align='left' sx={{ flexDirection: "column", mt: 5, maxWidth: 250, ml: 5 }}>
                        <Box display="flex" justifyContent="left" gap={"5px"} color={"var(--secColor)"} sx={{ flexDirection: "row" }}>
                            <EmailIcon sx={{ fontSize: 25, marginTop: 0.3 }} />
                            <Typography color={"var(--secColor)"} fontSize="20px">Email:</Typography>
                        </Box>
                        <Typography color='#5b5b5b' fontSize="20px" sx={{ ml: 4 }}>{user?.email} </Typography>
                        <Box display="flex" justifyContent="left" gap={"5px"} color={"var(--secColor)"} sx={{ flexDirection: "row", mt: 2 }}>
                            <PublicIcon sx={{ fontSize: 25, marginTop: 0.5 }} />
                            <Typography color={"var(--secColor)"} fontSize="20px">Country:</Typography>
                        </Box>
                        <Typography color={"#5b5b5b"} fontSize="20px" sx={{ ml: 4 }}>{user?.country}</Typography>
                        <Box display="flex" justifyContent="left" color={"var(--secColor)"} sx={{ flexDirection: "row", mt: 2 }}>
                            <MaleIcon sx={{ fontSize: 20, marginTop: 0.5 }} />
                            <Typography color={"var(--secColor)"} fontSize="20px">/</Typography>
                            <FemaleIcon sx={{ fontSize: 20, marginTop: 0.5 }} />

                            <Typography color={"var(--secColor)"} fontSize="20px">Gender:</Typography>
                        </Box>
                        <Typography color={"#5b5b5b"} fontSize="20px" sx={{ ml: 4 }}>{user?.gender}</Typography>
                    </Box>

                    {role !== "Corporate" && (
                        <Box display={"flex"} align='left' sx={{ flexDirection: "column", mt: 5, maxWidth: 250, ml: 60 }}>
                            <Box display="flex" justifyContent="left" gap={"5px"} color={"var(--secColor)"} sx={{ flexDirection: "row" }}>
                                <AccountBalanceWalletIcon sx={{ fontSize: 25, marginTop: 0.3 }} />
                                <Typography color={"var(--secColor)"} fontSize="20px">Wallet:</Typography>
                            </Box>
                            <Typography color={"#5b5b5b"} fontSize="20px" sx={{ ml: 4 }}>{user?.walletId?.balance} USD</Typography>
                        </Box>
                    )}
                </Box>
            </Container>

        </ThemeProvider>
    );
}

const mapStateToProps = (state) => ({
    user: state?.auth?.user,
    token: state?.auth?.token,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TraineeProfile);