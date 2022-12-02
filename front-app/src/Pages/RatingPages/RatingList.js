import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography, Box, Container, CssBaseline, Rating, FormHelperText, Select, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";

const theme = createTheme();
export const RatingsList = ({ auth, ratings }) => {

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
                                <TableCell align="center">Review</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ratings?.map((row) => (
                                <TableRow
                                    key={row.courseId._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="center">{row.courseId.title}</TableCell>
                                    <TableCell align="center">
                                        <Rating
                                            fullWidth
                                            value={row.rating}
                                            readOnly
                                        /></TableCell>
                                    <TableCell align="center">{row.review}</TableCell>
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
    ratings: state?.ratings?.ratings
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(RatingsList);