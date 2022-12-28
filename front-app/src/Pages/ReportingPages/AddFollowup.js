import * as React from 'react';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { Typography, Box, Container, MenuItem, CssBaseline, Button, Avatar, Select } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { MainInput, MainTextArea, main_button } from '../../app/components/Styles';
import { addFollowup } from '../../app/store/actions/reportActions';
const theme = createTheme();

export const Followup = ({ addFollowup, auth }) => {

    const reportId = useParams().id;
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        var details = {
            creation: {
                content: data.get('content'),
                reportId: reportId
            },
            token: auth.token
        }
        addFollowup(details, navigate)
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        minWidth: "50%",
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'var(--secColor)' }}>
                        <ReportProblemIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Follow up on report
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, minWidth: "100%" }}>
                        <MainTextArea
                            margin="normal"
                            fullWidth
                            name="content"
                            label="Follow Up Details"
                            type="text"
                            id="content"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, ...main_button }}
                        >
                            Add
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

const mapDispatchToProps = { addFollowup };

export default connect(mapStateToProps, mapDispatchToProps)(Followup);