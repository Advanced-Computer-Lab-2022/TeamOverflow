import * as React from 'react';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { Typography, Box, Container, MenuItem, CssBaseline, Button, Avatar, Select } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { MainInput, MainTextArea, main_button } from '../../app/components/Styles';
import { reportProblem } from '../../app/store/actions/reportActions';
const theme = createTheme();

export const ReportProblem = ({ reportProblem, auth }) => {

    const [type, setType] = React.useState("Other");
    const handleTypeChange = (event) => {
        setType(event.target.value)
    }
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        var details = {
            creation: {
                type: type,
                details: data.get('details')
            },
            token: auth.token
        }
        reportProblem(details, navigate)
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
                        Report a problem
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, minWidth: "100%" }}>
                        <Typography>Problem Type</Typography>
                        <Select
                            fullWidth
                            name="simple-controlled"
                            value={type}
                            onChange={handleTypeChange}
                            sx={{mb: 1}}
                        >
                            <MenuItem key={1} value="Financial">
                                Financial
                            </MenuItem>
                            <MenuItem key={2} value="Technical">
                                Technical
                            </MenuItem>
                            <MenuItem key={3} value="Other">
                                Other
                            </MenuItem>
                        </Select>
                        <MainTextArea
                            margin="normal"
                            fullWidth
                            name="details"
                            label="Problem Details"
                            type="text"
                            id="details"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, ...main_button }}
                        >
                            Report
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

const mapDispatchToProps = { reportProblem };

export default connect(mapStateToProps, mapDispatchToProps)(ReportProblem);