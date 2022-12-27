import React from "react";
import "./App.css";
import Router from "./Router";
import { BrowserRouter } from "react-router-dom";
import { TopBar } from "./app/components";
import { createTheme, ThemeProvider } from "@mui/material";
import BackToTop from 'react-back-to-top';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const theme = createTheme({
  palette: {
    primary: {
      main: '#A00407',
      secondary: "rgba(231,129,132,0.75)"
    },
    secondary: {
      main: '#A00407'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter>
          <TopBar />
          <Router />
          <BackToTop
            mainStyle={{
              "border-radius": 30,
              "background-color":"var(--terColor2)"
            }}
            children={<KeyboardArrowUpIcon sx={{color: "var(--secColor)"}}/>}
            isPercent={false}
            offsetTop={0}
            step={50}/>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
