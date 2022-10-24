import React from "react";
import { connect } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { Index, AddUsers } from "./Pages";
import ProtectedRoute from "./ProtectedRoute";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" exact element={<Index/>}/>
      <Route exact element={<ProtectedRoute allowed={["Admin"]}/>}>
        <Route path="/addUsers" exact element={<AddUsers/>}/>
      </Route>
    </Routes>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Router);
