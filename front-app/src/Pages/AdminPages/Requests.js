import * as React from 'react';
import { Typography, Paper, IconButton, InputBase, Box, Container, Pagination, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Button, Slider, Select, MenuItem, Card, FormHelperText, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { viewReports, clearReports } from '../../app/store/actions/reportActions';
import { CourseCard, RefundsCard, ReportCard, RequestsCard } from '../../app/components';
import InboxIcon from '@mui/icons-material/Inbox';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { centered_flex_box, main_button } from '../../app/components/Styles';
import { viewRefunds, viewRequests } from '../../app/store/actions/adminActions';
import { useNavigate } from 'react-router-dom';
const theme = createTheme();

export const ReportedProblems = ({ auth, requests, viewRequests, viewRefunds, isLoading }) => {

    const role = auth.token.split(" ")[0];
    const navigate = useNavigate();

    const [formData, setFormData] = React.useState({
        page: parseInt(requests?.requests?.page) || 1
    })

    const { page } = formData

    const handlePageChange = (event, value) => {
        setFormData({ ...formData, page: value })
        if(requests.type === "Course"){
            viewRequests({info:{page: value}, token:auth?.token})
        } else {
            viewRefunds({info:{page: value}, token:auth?.token})
        }
    }

    if (requests?.type === undefined) {
        navigate('/Admin');
    }

    if (isLoading) {
        return (
            <Box sx={{ ...centered_flex_box, minHeight: "100vh" }}>
                <CircularProgress sx={{ color: "var(--secColor)" }} />
            </Box>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl">
                <Box sx={{ ...centered_flex_box, marginY: 2 }}>
                    <Typography variant="h3">{requests?.type} Requests</Typography>
                </Box>
                <Box>
                    <Grid container spacing={3} sx={centered_flex_box}>
                        {requests?.requests?.docs?.map((request) => {
                            return (
                                <Grid item xs={5}>
                                    {requests?.type === "Course" ? <RequestsCard request={request} /> : <RefundsCard refund={request} />}
                                </Grid>
                            )
                        })}
                        {requests?.requests?.docs?.length === 0 && (
                                <Grid item sx={{ ...centered_flex_box, flexDirection: "column", mt: 2 }}>
                                    <InboxIcon fontSize="large" />
                                    <Typography fontSize={40}>No results</Typography>
                                </Grid>
                            )}
                    </Grid>
                    <Box sx={{ ...centered_flex_box, m: 1 }}>
                        <Pagination count={requests?.requests?.pages || 1} page={page} onChange={handlePageChange} />
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

const mapStateToProps = (state) => ({
    auth: state?.auth,
    requests: state?.requests,
    isLoading: state?.requests?.isLoading
});

const mapDispatchToProps = { viewRequests, viewRefunds };

export default connect(mapStateToProps, mapDispatchToProps)(ReportedProblems);