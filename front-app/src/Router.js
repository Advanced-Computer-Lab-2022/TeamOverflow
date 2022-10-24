import React from "react";
import { connect } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { Index, AddUsers } from "./Pages";
import AdminRoute from "./ProtectedRoute/AdminRoute";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" exact element={<Index/>}/>
      <Route path="/addUsers" exact element={<AddUsers/>} />
    </Routes>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Router);
