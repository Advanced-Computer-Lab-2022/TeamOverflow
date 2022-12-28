import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Typography, Box, Container, CssBaseline, Rating, FormHelperText, Select, MenuItem, Pagination, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from "react-redux";
import { getInvoices, getWallet } from '../../app/store/actions/authActions';
import moment from "moment";
import { centered_flex_box } from '../../app/components/Styles';

const theme = createTheme();
export const InvoiceList = ({ token, invoices, getInvoices, isLoading, getWallet, wallet }) => {

    React.useEffect(() => {
        getInvoices({
            query: {
                page: 1
            },
            token: token
        })
        getWallet(token)
    }, [])

    const handlePageChange = (event, value) => {
        getInvoices({
            query: {
                page: value
            },
            token: token
        })
    }

    if (isLoading) {
        return (
            <Box sx={centered_flex_box}>
                <CircularProgress sx={{ color: "var(--secColor)" }} />
            </Box>
        )
    }

    return (
        <Container component="main" maxWidth="xl">
            <Box my={2}>
                <Typography variant="h4"><AccountBalanceWalletIcon fontSize='large'/> {wallet?.currency} {wallet?.balance}</Typography>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>Date</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>Course Title</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>Debit</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>Credit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices?.docs?.map((row) => (
                            <TableRow
                                key={row._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center"><Typography>{moment(row.createdAt).format("DD/MM/yyyy")}</Typography></TableCell>
                                <TableCell align="center"><Typography>{row.courseId.title}</Typography></TableCell>
                                <TableCell align="center"><Typography sx={{ color: "green" }}>{row.balance > 0 ? `${row.currency} ${row.balance}` : "-"}</Typography></TableCell>
                                <TableCell align="center"><Typography sx={{ color: "red" }}>{row.balance < 0 ? `${row.currency} ${row.balance * -1}` : "-"}</Typography></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ ...centered_flex_box, m: 1 }}>
                <Pagination count={invoices?.pages || 1} page={parseInt(invoices?.page)} onChange={handlePageChange} />
            </Box>
        </Container>
    );
}

const mapStateToProps = (state) => ({
    token: state?.auth?.token,
    isLoading: state?.auth?.isLoading,
    wallet: state?.auth?.wallet,
    invoices: state?.auth?.invoices
});

const mapDispatchToProps = { getInvoices, getWallet };

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceList);