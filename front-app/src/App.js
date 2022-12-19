import React from "react";
import "./App.css";
import Router from "./Router";
import { BrowserRouter } from "react-router-dom";
import { TopBar } from "./app/components";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <TopBar />
        <Router />
      </BrowserRouter>
    </div>
  );
}

export default App;
