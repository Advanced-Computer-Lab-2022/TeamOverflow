import * as React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography, Box, Card, Container, CssBaseline, Button, InputBase, FormHelperText, Select, MenuItem, TextField, TextareaAutosize, Accordion, AccordionSummary, AccordionDetails, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import FeedbackIcon from '@mui/icons-material/Feedback';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { respondReport, viewFollowups } from '../../app/store/actions/reportActions';
import { centered_flex_box, left_flex_box, MainInput, MainTextArea, main_button, right_flex_box } from '../../app/components/Styles';
import moment from 'moment';

const theme = createTheme();

export const ReportView = ({ token, viewFollowups, respondReport, report, followups, isLoading }) => {

    const reportId = useParams().id
    const navigate = useNavigate()
    const role = token?.split(" ")[0]

    React.useEffect(() => {
        viewFollowups({
            query: {
                reportId: reportId
            },
            token: token
        });
    }, [])

    const handleAddFollowup = (event) => {
        navigate(`/reports/followup/${report._id}`)
    }

    const handleResolve = (event) => {
        navigate(-1)
        respondReport({ token: token, info: { status: "Resolved", reportId: reportId } })
    }

    const handlePending = (event) => {
        navigate(-1)
        respondReport({ token: token, info: { status: "Pending", reportId: reportId } })
    }

    if (isLoading) {
        return (
            <Box sx={centered_flex_box}>
                <CircularProgress sx={{ color: "var(--secColor)" }} />
            </Box>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl">
                <Card sx={{ padding: 3 }}>
                    <Box sx={right_flex_box}>
                        <Typography variant="h4">{report?.status} {report?.type} Problem</Typography>
                    </Box>
                    <Box sx={right_flex_box}>
                        <Typography textAlign="justify">{report?.details}</Typography>
                    </Box>
                    <Accordion sx={{ mt: 3 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography fontWeight="bold">Follow Ups</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {
                                followups?.map((followup) => (
                                    <Card sx={{ m: 1, p:3, borderRadius: 10 }}>
                                        <Typography fontSize={20}><FeedbackIcon/>  {followup.content}</Typography>
                                        <Typography fontStyle="italic" color="var(--secColor)">{moment(followup.createdAt).format("MM/DD/yyyy HH:mm")}</Typography>
                                    </Card>
                                ))
                            }
                        </AccordionDetails>
                    </Accordion>
                    {role === "Admin" && (
                        <Accordion sx={{ mb: 2 }} expanded={true}>
                            <AccordionSummary>
                                <Typography fontWeight="bold">User Data</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: "flex", justifyContent: "left", flexDirection: "column" }}>
                                    <Typography>User Id: {report?.userId?._id}</Typography>
                                    <Typography>User Type: {report?.userRef}</Typography>
                                    <Typography>User Name: {report?.userId?.name || "Unknown"}</Typography>
                                    <Typography>User Email: {report?.userId?.email || "Unknown"}</Typography>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    )}
                    <Box sx={left_flex_box}>
                        {role !== "Admin" && <Button sx={{ ...main_button, mt: 2 }} onClick={handleAddFollowup}>Follow up on report</Button>}
                        {role === "Admin" && report?.status !== "Resolved" && <>
                            {report?.status !== "Resolved" && report?.status !== "Pending" && <Button sx={{ ...main_button, mx: 2 }} onClick={handlePending}>Set status to "Pending"</Button>}
                            {report?.status !== "Resolved" && <Button sx={{ ...main_button }} onClick={handleResolve}>Set status to "Resolved"</Button>}
                        </>}
                    </Box>
                </Card>
            </Container>
        </ThemeProvider>
    );
}

const mapStateToProps = (state) => ({
    token: state?.auth?.token,
    report: state?.reports?.single?.report,
    followups: state?.reports?.single?.followups,
    isLoading: state?.reports?.isLoading
});

const mapDispatchToProps = { viewFollowups, respondReport };

export default connect(mapStateToProps, mapDispatchToProps)(ReportView);