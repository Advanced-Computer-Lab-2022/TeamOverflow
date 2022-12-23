import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Container, CssBaseline, Rating, FormHelperText, Select, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { getRegisteredCourses } from '../../app/store/actions/coursesActions';

const theme = createTheme();
export const TraineeCoursesList = ({ auth, courses, getRegisteredCourses }) => {

    React.useEffect(() => {
        getRegisteredCourses(auth?.token)
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl">
                <CssBaseline />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Course</TableCell>
                                <TableCell align="center">Rating</TableCell>
                                <TableCell align="center">Instructor</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courses?.map((row) => (
                                <TableRow
                                    key={row._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="center"><NavLink to={`/courses/student/single/${row._id}`}>{row.title}</NavLink></TableCell>
                                    <TableCell align="center">
                                        <Rating
                                            fullWidth
                                            value={row.rating}
                                            readOnly
                                        /></TableCell>
                                    <TableCell align="center"><NavLink to={`/Rate/instructorId=${row.instructorId._id}`}>{row.instructorId.name}</NavLink></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </ThemeProvider>
    );
}

const mapStateToProps = (state) => ({
    auth: state?.auth,
    courses: state?.courses?.results
});

const mapDispatchToProps = {getRegisteredCourses};

export default connect(mapStateToProps, mapDispatchToProps)(TraineeCoursesList);