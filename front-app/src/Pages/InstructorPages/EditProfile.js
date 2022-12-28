import * as React from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Typography, Box, Container, TextField, CssBaseline, Button, Avatar, Select, MenuItem, FormHelperText, InputLabel, FormControl } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { editProfile } from '../../app/store/actions/instructorActions';
import { changePassword } from '../../app/store/actions/authActions';
import { useNavigate, useParams } from 'react-router-dom';
import countryList from 'country-json/src/country-by-name.json'
import { selectCountry } from '../../app/store/actions/traineeActions';
import { centered_flex_box, MainInput, MainSelect, MainTextArea, main_button } from '../../app/components/Styles';


const theme = createTheme();

export const EditProfile = ({ auth, editProfile, selectCountry, changePassword }) => {

    const [country, setCountry] = React.useState(auth.user.country)
    const handleCountryChange = (event) => {
        setCountry(event.target.value)
    }
    let navigate = useNavigate();
    let path = `/Instructor/profile`;



    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        var details = {
            edits: {
                name: data.get('name'),
                email: data.get('email'),
                bio: data.get('bio'),
                country: country
            },
            token: auth.token
        }
        editProfile(details);
        navigate(path);
    };


    return (
        <ThemeProvider theme={theme}>
            <Container component="main" sx={{ maxWidth: "800px" }}>
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
                        <AccountCircle />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Update Profile
                    </Typography>
                    <Box sx={centered_flex_box}>
                        <Box sx={{ mt: 1 }}>
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
                            <MainTextArea
                                margin="normal"
                                fullWidth
                                id="bio"
                                label="Mini Biography"
                                name="bio"
                                autoFocus
                            />
                            <FormControl sx={{minWidth: "100%", mt:3}}>
                                <InputLabel id="demo-multiple-country-label">Country</InputLabel>
                                <Select
                                    defaultValue={country}
                                    name="country"
                                    id="country"
                                    labelId="demo-multiple-country-label"
                                    label="User Country"
                                    fullWidth
                                    onChange={handleCountryChange}
                                >
                                    {countryList.map((country, i) => {
                                        return (
                                            <MenuItem key={i} value={country.country}>
                                                {country.country}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                                <FormHelperText>Select your country</FormHelperText>
                            </FormControl>
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

const mapDispatchToProps = { editProfile, changePassword };

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);