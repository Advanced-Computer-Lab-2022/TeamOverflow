import * as React from 'react';
import PercentIcon from '@mui/icons-material/Percent';
import { Typography, Box, Container, TextField, CssBaseline, Button, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { defineDiscount } from '../../app/store/actions/instructorActions';
import { MainInput, main_button } from '../../app/components/Styles';

const theme = createTheme();

export const Discount = ({ auth, defineDiscount }) => {

    const id = useParams().id
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        var details = {
            creation: {
                discount: data.get('discount'),
                startDate: data.get('startDate'),
                deadline: data.get('deadline'),
                courseId: id
            },
            token: auth.token
        }
        defineDiscount(details, navigate);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'var(--secColor)' }}>
                        <PercentIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Add Discount
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <MainInput
                            margin="normal"
                            required
                            fullWidth
                            id="discount"
                            label="Discount %"
                            name="discount"
                            autoComplete="discount"
                            type="number"
                            autoFocus
                            inputProps={{min:0, max:100}}
                        />
                        <MainInput
                            margin="normal"
                            required
                            fullWidth
                            name="startDate"
                            label="Discount Start Date"
                            type="datetime-local"
                            id="startDate"
                            focused
                        />
                        <MainInput
                            margin="normal"
                            required
                            fullWidth
                            name="deadline"
                            label="Discount deadline"
                            type="datetime-local"
                            id="deadline"
                            focused
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, ...main_button }}
                        >
                            Confirm Discount
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

const mapStateToProps = (state) => ({
    auth: state?.auth
});

const mapDispatchToProps = { defineDiscount };

export default connect(mapStateToProps, mapDispatchToProps)(Discount);