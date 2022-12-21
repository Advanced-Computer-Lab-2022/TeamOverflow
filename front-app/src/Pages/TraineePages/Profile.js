import * as React from 'react';
import { Typography, Container, CssBaseline, Button} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';
import { connect } from "react-redux";
import { useNavigate} from 'react-router-dom';
import { Box } from '@mui/system';

const theme = createTheme();

export  const TraineeProfile = ({ user }) => {

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `/Trainee/edit`; 
        navigate(path);
      }
    const routeChange1 = () =>{ 
        let path = `/Trainee/editPassword`; 
        navigate(path);
      }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl" >
                <CssBaseline />
                <Box display="flex" justifyContent="right" gap={"5px"}  sx={{flexDirection:"row"}}>
                <Button  onClick={routeChange} sx={{color:"var(--secColor)"}}>Update Profile</Button>
                <Button  onClick={routeChange1} sx={{color:"var(--secColor)"}}>Update Password</Button>

                </Box>


                <Box display="flex" justifyContent="center" marginTop={"60px"} gap = "5px" color={"var(--secColor)"}>
                <AccountCircleIcon sx={{ fontSize: 50, marginTop:1.5 }} />
                <Typography fontWeight={"Bold"} fontSize="50px" color={"black"} >{user?.name}</Typography>
                </Box>
                
                <Box display={"flex"} sx={{flexDirection:"column"}}>
                    <Box display="flex" justifyContent="left" gap={"5px"} color={"var(--secColor)"} sx={{flexDirection:"row"}}>
                        <EmailIcon sx={{ fontSize: 25, marginTop:0.5 }}/>
                        <Typography  color={"black"} fontSize="20px">{user?.email}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="left" gap={"5px"} color={"var(--secColor)"} sx={{flexDirection:"row"}}>
                        <PublicIcon sx={{ fontSize: 25, marginTop:0.5 }} />
                        <Typography  color={"black"} fontSize="20px">{user?.country}</Typography> 
                    </Box>
                </Box>

            </Container>
        </ThemeProvider>
    );
}

const mapStateToProps = (state) => ({
    user: state?.auth?.user,
    course: state?.courses?.single
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TraineeProfile);