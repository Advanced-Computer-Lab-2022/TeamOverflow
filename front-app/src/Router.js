import React from "react";
import { connect } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { ReportedProblems, TraineeProfile, Register, Terms, Index, AddUsers, AdminHome, AllCourses, TraineeCourses, TraineeHome, InstructorCourses, InstructorHome, CreateCourse, Rate, SingleCourseInstructor, SingleCourse, InstructorVidView, CreateExam, UploadVideo, Discount, RatingList, InstructorProfile, InstructorEditProfile, InstructorContract, StudentVidView, Exam, Result, Forgot, Reset, PaymentDone, EditTraineeProfile, EditInstructorPassword, CoursePreview, ReportProblem, Followup, ReportView, DefineDiscounts, ViewExam, Invoices } from "./Pages";
import { TopBar } from "./app/components";
import { useLocation } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "./Pages/InstructorPages/Profile";
import { EditTraineePassword } from "./Pages/TraineePages";
import { AdminProfile, EditAdminPassword, EditAdminProfile, Requests } from "./Pages/AdminPages";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" exact element={<Index />} />
      <Route path="/forgot-password" exact element={<Forgot />} />
      <Route path="/register" exact element={<Register />} />
      <Route path="/terms" exact element={<Terms />} />
      <Route path="/reset-password/:token" exact element={<Reset />} />
      <Route exact element={<ProtectedRoute allowed={["Admin"]} />}>
        <Route path="/Admin" exact element={<AdminHome />} />
        <Route path="/Admin/addUsers" exact element={<AddUsers />} />
        <Route path="/Admin/profile" exact element={<AdminProfile />} />
        <Route path="/Admin/edit" exact element={<EditAdminProfile />} />
        <Route path="/Admin/editPassword" exact element={<EditAdminPassword />} />
        <Route path="/Admin/requests" exact element={<Requests />} />
        <Route path="/Admin/promotions" exact element={<DefineDiscounts />} />

      </Route>
      <Route exact element={<ProtectedRoute allowed={["Instructor"]} />}>
        <Route path="/courses/instructor" exact element={<InstructorCourses />} />
        <Route path="/courses/instructor/single/:id" exact element={<SingleCourseInstructor />} />
        <Route path="/Instructor" exact element={<InstructorHome />} />
        <Route path="/Instructor/profile" exact element={<InstructorProfile />} />
        <Route path="/Instructor/edit" exact element={<InstructorEditProfile />} />
        <Route path="/Instructor/editPassword" exact element={<EditInstructorPassword />} />
        <Route path="/Instructor/ratings" exact element={<RatingList />} />
        <Route path="/Instructor/contract" exact element={<InstructorContract />} />
        <Route path="/Instructor/invoices" exact element={<Invoices />} />
        <Route path="/courses/create" exact element={<CreateCourse />} />
        <Route path="/courses/ratings/:id" exact element={<RatingList />} />
        <Route path="/courses/ratings" exact element={<RatingList />} />
        <Route path="/course/exercise/create/:id" exact element={<CreateExam />} />
        <Route path="/course/exercise/view/:id" exact element={<ViewExam />} />
        <Route path="/course/video/upload/:id" exact element={<UploadVideo />} />
        <Route path="/course/discount/:id" exact element={<Discount />} />
      </Route>
      <Route exact element={<ProtectedRoute allowed={["Trainee"]} />}>
        <Route path="/Trainee" exact element={<TraineeHome />} />
        <Route path="/Trainee/profile" exact element={<TraineeProfile />} />
        <Route path="/Trainee/edit" exact element={<EditTraineeProfile />} />
        <Route path="/Trainee/editPassword" exact element={<EditTraineePassword />} />
        <Route path="/paymentCompleted/:session_id/:courseId/:fromWallet" exact element={<PaymentDone />} />
      </Route>
      <Route exact element={<ProtectedRoute allowed={["Corporate"]} />}>
        <Route path="/Corporate" exact element={<TraineeHome />} />
      </Route>
      <Route exact element={<ProtectedRoute allowed={["Corporate", "Trainee", "Guest", "Instructor"]} />}>
        <Route path="/courses" exact element={<AllCourses />} />
        <Route path="/courses/preview/:id" exact element={<CoursePreview />} />
        <Route path="/course/video/:id" exact element={<InstructorVidView />} />
      </Route>
      <Route exact element={<ProtectedRoute allowed={["Corporate", "Trainee", "Instructor", "Admin"]} />}>
        <Route path="/reports" exact element={<ReportedProblems />} />
        <Route path="/reports/single/:id" exact element={<ReportView />} />
      </Route>
      <Route exact element={<ProtectedRoute allowed={["Corporate", "Trainee", "Instructor"]} />}>
        <Route path="/reports/add" exact element={<ReportProblem />} />
        <Route path="/reports/followup/:id" exact element={<Followup />} />
      </Route>
      <Route exact element={<ProtectedRoute allowed={["Corporate", "Trainee"]} />}>
        <Route path="/Rate/:id" exact element={<Rate />} />
        <Route path="/instructor/ratings/:id" exact element={<RatingList />} />
        <Route path="/course/ratings/:id" exact element={<RatingList />} />
        <Route path="/courses/student" exact element={<TraineeCourses />} />
        <Route path="/courses/student/single/:id" exact element={<SingleCourse />} />
        <Route path="/course/watch/:courseId/:videoId" exact element={<StudentVidView />} />
        <Route path="/course/solve/exercise/:courseId/:exerciseId" exact element={<Exam />} />
        <Route path="/course/grade/:answerId" exact element={<Result />} />
      </Route>
      <Route path="*" exact element={<Index />} />
    </Routes>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Router);
