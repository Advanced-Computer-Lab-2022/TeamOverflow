import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Card, CircularProgress, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { centered_flex_box, confirm_button, main_button } from './Styles';

export default function WalletModal({ open, handleClose, action, wallet }) {

    const [fromWallet, setFromWallet] = React.useState(false)
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={{ ...centered_flex_box, minHeight: "100vh" }}>
                <Card sx={{ display: "flex", p: 3, flexDirection: "column" }}>
                    <Box sx={{ ...centered_flex_box, mb: 1 }}>
                        <Typography variant='h4'>How would you like to pay?</Typography>
                    </Box>
                    <Box sx={{ ...centered_flex_box, mb: 2 }}>
                        {wallet ?
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                name="radio-buttons-group"
                                value={fromWallet}
                                onChange={(event) => setFromWallet(event.target.value)}
                            >
                                <FormControlLabel control={<Radio value={true} disabled={wallet?.balance == 0} />} label={`Pay from wallet: ${wallet?.currency} ${wallet?.balance}`} />
                                <FormControlLabel control={<Radio value={false} />} label="Card Only" />
                            </RadioGroup> :
                            <CircularProgress sx={{color: "var(--secColor)"}} />
                        }
                    </Box>
                    <Box sx={{ ...centered_flex_box }}>
                        <Button value={fromWallet} onClick={action} sx={{ ...confirm_button, mx: 2 }}>Proceed</Button>
                        <Button onClick={handleClose} sx={main_button}>Cancel</Button>
                    </Box>
                </Card>
            </Box>
        </Modal >
    );
}