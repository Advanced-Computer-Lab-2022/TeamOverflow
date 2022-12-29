import * as React from 'react';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { Typography, Box, Modal, MenuItem, Card, Button, Avatar, Select } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { MainInput, MainTextArea, main_button, centered_flex_box, confirm_button } from '../../app/components/Styles';
import { reportProblem } from '../../app/store/actions/reportActions';

function ReportModal({ token, reportProblem, courseId, open, handleClose }) {

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
                details: data.get('details'),
                courseId: courseId
            },
            token: token
        }
        reportProblem(details)
        handleClose()
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={{ ...centered_flex_box, minHeight: "100vh" }}>
                <Card sx={{ display: "flex", alignItems: "center", p: 4, flexDirection: "column" }}>
                    <Avatar sx={{ m: 1, bgcolor: 'var(--secColor)' }}>
                        <ReportProblemIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Report a problem with course
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, minWidth: "100%" }}>
                        <Typography>Problem Type</Typography>
                        <Select
                            fullWidth
                            name="simple-controlled"
                            value={type}
                            onChange={handleTypeChange}
                            sx={{ mb: 1 }}
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
                            required
                        />
                        <Box sx={{ ...centered_flex_box, mt:1 }}>
                            <Button type="submit" sx={{ ...confirm_button, mr: 2 }}>Confirm</Button>
                            <Button onClick={handleClose} sx={main_button}>Cancel</Button>
                        </Box>
                    </Box>
                </Card>
            </Box>
        </Modal>
    );
}

const mapStateToProps = (state) => ({
    token: state?.auth?.token
});

const mapDispatchToProps = { reportProblem };

export default connect(mapStateToProps, mapDispatchToProps)(ReportModal);