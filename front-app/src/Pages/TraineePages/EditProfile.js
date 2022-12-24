import * as React from 'react';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { Typography, Box, Container, TextField, CssBaseline, Button, Avatar, Select, MenuItem, FormHelperText } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { editProfile } from '../../app/store/actions/traineeActions';
import { changePassword } from '../../app/store/actions/authActions';

import countryList from 'country-json/src/country-by-name.json'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainInput, main_button } from '../../app/components/Styles';


const theme = createTheme();

export const EditProfile = ({ auth, editProfile }) => {

    const [country, setCountry] = useState(auth.user.country)
    const handleCountryChange = (event) => {
      setCountry(event.target.value)
    }

    let navigate = useNavigate(); 
    let path = `/Trainee/profile`; 
        

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        var details = {
            edits: {
                name: data.get('name'),
                email: data.get('email'),
                country: country
            },
            token: auth.token
        }

        editProfile(details);
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
                        <OndemandVideoIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Update Profile
                    </Typography>
                    <Box  sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Box   sx={{ mt: 1}}>
                        <MainInput
                                margin="normal"
                                fullWidth
                                name="email"
                                label="Email"
                                type="email"
                                id="email"
                                
                            />
                        <MainInput
                                margin="normal"
                                fullWidth
                                id="name"
                                label="Full Name"
                                name="name"
                                autoFocus                            
                            />
                            <Select
                                sx={{marginTop:"15px"}}
                                defaultValue={country}
                                name="country"
                                id='country'
                                label="User Country"
                                fullWidth
                                onChange={handleCountryChange}        
                                >
                                {countryList.map((country, i) => {return (
                                    <MenuItem key={i} value={country.country}>
                                    {country.country}
                                    </MenuItem>
                                )})}
                            </Select>
                            
                            <FormHelperText>Select your country</FormHelperText>



                        </Box>
                    </Box>
                    <Button
                        type="submit"
                        
                        variant="contained"
                        sx={{ mt: 3, mb: 2, ...main_button }}

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

const mapDispatchToProps = { editProfile };

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);