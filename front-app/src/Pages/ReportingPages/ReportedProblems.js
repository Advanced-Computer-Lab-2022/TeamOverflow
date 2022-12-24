import * as React from 'react';
import { Typography, Paper, IconButton, InputBase, Box, Container, Pagination, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Button, Slider, Select, MenuItem, Card, FormHelperText, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { viewReports, clearReports } from '../../app/store/actions/reportActions';
import { CourseCard, ReportCard } from '../../app/components';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { centered_flex_box, main_button } from '../../app/components/Styles';

const theme = createTheme();

export const ReportedProblems = ({ auth, reports, viewReports, clearReports }) => {

    const role = auth.token.split(" ")[0];

    React.useEffect(() => {
        clearReports()
        viewReports({ token: auth.token, ...formData });
    }, [])

    const [formData, setFormData] = React.useState({
        type: null,
        status: null,
        page: parseInt(reports?.results?.page) || 1
    })

    const handleClearFilter = (event) => {
        setFormData({
            type: null,
            status: null,
            page: 1
        })
        viewReports({ token: auth.token, type: null, status: null, page: 1});
    }

    const { type, status, page } = formData

    const handleTypeChange = (event) => {
        setFormData({ ...formData, type: event.target.value })
    }

    const handleStatusChange = (event) => {
        setFormData({ ...formData, status: event.target.value })
    }

    const handlePageChange = (event, value) => {
        setFormData({...formData, page: value})
        viewReports({ token: auth.token, ...formData, page: value });
    }

    const handleFilter = (event) => {
        viewReports({ token: auth.token, ...formData });
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl">
                <Box sx={{ ...centered_flex_box, marginY: 2 }}>
                    <Typography variant="h3">Reported Problems</Typography>
                </Box>
                <Grid container direction="row" display="flex" justifyContent="space-evenly" alignItems="center">
                    <Grid item xs={6} display="flex-row" alignItems="center">
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Filters</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                Type Filter:
                                <Select
                                    label="Subject"
                                    id="Subject"
                                    name="subj"
                                    onChange={handleTypeChange}
                                    value={type}
                                    defaultValue=""
                                    fullWidth
                                >
                                    <MenuItem key={0} value="">
                                        Any
                                    </MenuItem>
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
                                <FormHelperText>Select status to filter</FormHelperText>
                                Status Filter:
                                <Select
                                    label="Subject"
                                    id="Subject"
                                    name="subj"
                                    onChange={handleStatusChange}
                                    value={status}
                                    defaultValue=""
                                    fullWidth
                                >
                                    <MenuItem key={0} value="">
                                        Any
                                    </MenuItem>
                                    <MenuItem key={1} value="Unseen">
                                        Unseen
                                    </MenuItem>
                                    <MenuItem key={2} value="Pending">
                                        Pending
                                    </MenuItem>
                                    <MenuItem key={3} value="Resolved">
                                        Resolved
                                    </MenuItem>
                                </Select>
                                <FormHelperText>Select status to filter</FormHelperText>
                                <Button sx={{ ...main_button, margin: 1 }} onClick={handleFilter}>Apply Filters</Button>
                                <Button sx={{ ...main_button, margin: 1 }} onClick={handleClearFilter}>Clear Filters</Button>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
                <hr />
                <Box>
                    {!reports?.isLoading ? (
                        <Grid container spacing={1}>
                            {reports?.results?.docs?.map((report) => {
                                return (
                                    <Grid item xs={12}>
                                        <ReportCard report={report} />
                                    </Grid>
                                )
                            })}
                        </Grid>
                    ) : (
                        <Box sx={centered_flex_box}>
                            <CircularProgress sx={{ color: "var(--secColor)" }} />
                        </Box>
                    )}
                    <Box sx={{ ...centered_flex_box, m: 1 }}>
                        <Pagination count={reports?.results?.pages || 1} page={page} onChange={handlePageChange} />
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

const mapStateToProps = (state) => ({
    auth: state?.auth,
    reports: state?.reports
});

const mapDispatchToProps = { clearReports, viewReports };

export default connect(mapStateToProps, mapDispatchToProps)(ReportedProblems);