import * as React from 'react';
import { Typography, Box, Container, TextField, CssBaseline, Button, Avatar} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { changePassword } from '../../app/store/actions/authActions';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { MainInput, main_button } from '../../app/components/Styles';

const theme = createTheme();

export const EditPassword = ({ auth,  changePassword }) => {
    let navigate = useNavigate(); 
    let path = `/Instructor/profile`; 




    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        var details = {
            prevPassword: data.get('prevPassword'),
            password: data.get('password'),
            token: auth.token
        }
        changePassword(details);
        navigate(path);
    };
  

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" sx={{maxWidth: "800px"}}>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        
                    }}
                    component="form" onSubmit={handleSubmit}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'var(--secColor)' }}>
                        <LockIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Update Password
                    </Typography>
                    <Box  sx={{ maxWidth:"300px"}}>

                            <MainInput
                                margin="normal"
                                fullWidth
                                name='prevPassword'
                                id="prevPassword"
                                label="Old Password"
                                autoFocus                            
                            />
                            <MainInput
                                margin="normal"
                                fullWidth
                                name='password'
                                id="password"
                                label="New Password"
                                autoFocus                            
                            />

                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2, ...main_button}}

                   >
                        Update
                    </Button>

                </Box>
            </Container>
        </ThemeProvider>
    );
}

const mapStateToProps = (state) => ({
    auth: state?.auth
});

const mapDispatchToProps = {changePassword };

export default connect(mapStateToProps, mapDispatchToProps)(EditPassword);