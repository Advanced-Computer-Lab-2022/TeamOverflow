import React from "react";
import { connect } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { Index, AddUsers, AdminHome, AllCourses, CorporateHome, IndividualHome, InstructorCourses, InstructorHome, CreateCourse, RatingPage } from "./Pages";
import ProtectedRoute from "./ProtectedRoute";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" exact element={<Index/>}/>
      <Route exact element={<ProtectedRoute allowed={["Admin"]}/>}>
        <Route path="/Admin" exact element={<AdminHome/>}/>
        <Route path="/Admin/addUsers" exact element={<AddUsers/>}/>
      </Route>
      <Route exact element={<ProtectedRoute allowed={["Instructor"]}/>}>
        <Route path="/Instructor" exact element={<InstructorHome/>}/>
        <Route path="/courses/instructor" exact element={<InstructorCourses/>}/>
        <Route path="/courses/create" exact element={<CreateCourse/>}/>
      </Route>
      <Route exact element={<ProtectedRoute allowed={["Trainee"]}/>}>
        <Route path="/Trainee" exact element={<IndividualHome/>}/>
      </Route>
      <Route exact element={<ProtectedRoute allowed={["Corporate"]}/>}>
        <Route path="/Corporate" exact element={<CorporateHome/>}/>
      </Route>
      <Route exact element={<ProtectedRoute allowed={["Corporate", "Trainee", "Guest", "Instructor"]}/>}>
        <Route path="/courses" exact element={<AllCourses/>}/>
      </Route>
      <Route exact element={<ProtectedRoute allowed={["Corporate", "Trainee"]}/>}>
        <Route path="/Rate/Instructor/:id" exact element={<RatingPage toRate={"Instructor"}/>}/>
        <Route path="/Rate/Course/:id" exact element={<RatingPage toRate={"Course"}/>}/>
      </Route>
      <Route path="*" exact element={<Index/>}/>
    </Routes>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Router);
