import React from "react";
import { connect } from "react-redux";
import {Typography} from '@mui/material';

export const Index = () => {
  return (
    <div>
        <div>
            <Typography variant="h1" component="div" sx={{ flexGrow: 1 }}>
                Online Learning Platform
            </Typography>
        </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = { };

export default connect(mapStateToProps, mapDispatchToProps)(Index);
