import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Card } from '@mui/material';
import { centered_flex_box, confirm_button, main_button } from './Styles';

export default function ActionModal({ message, open, handleClose, action }) {
    return (

        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={{ ...centered_flex_box, minHeight: "100vh" }}>
                <Card sx={{display:"flex", p:3, flexDirection:"column"}}>
                        <Box sx={{ ...centered_flex_box, mb:1 }}>
                            <Typography variant='h4'>Please confirm action!</Typography>
                        </Box>
                        <Box sx={{ ...centered_flex_box, mb:2 }}>
                            <Typography>{message}</Typography>
                        </Box>
                        <Box sx={{ ...centered_flex_box }}>
                            <Button onClick={action} sx={{...confirm_button, mx:2}}>Confirm</Button>
                            <Button onClick={handleClose} sx={main_button}>Cancel</Button>
                        </Box>
                </Card>
            </Box>
        </Modal >
    );
}