import Index from "./IndexPage";

import { Home as AdminHome, AddUsers, DefineDiscounts, AdminProfile, EditAdminProfile,EditAdminPassword } from "./AdminPages";

import { Home as TraineeHome, TraineeProfile, EditTraineeProfile, EditTraineePassword } from "./TraineePages";
import { Home as InstructorHome, CreateCourse, SingleCourse as SingleCourseInstructor, CreateExam, ViewExam, UploadVideo, Discount, InstructorProfile, EditProfile as InstructorEditProfile, Contract as InstructorContract, EditInstructorPassword } from "./InstructorPages";
import { AllCourses, InstructorCourses, TraineeCourses, SingleCourse, CoursePreview } from "./CoursesPages";
import { Rate, RatingList } from "./RatingPages";
import { InstructorVidView, StudentVidView } from "./VideoPage";
import { Exam, Result } from "./ExamPages";
import { Forgot, Reset } from "./ForgotPasswordPages";
import { PaymentDone } from "./PaymentPages";
import { Register, Terms } from "./RegisterPage";
import { ReportedProblems, ReportProblem, Followup, ReportView } from "./ReportingPages";

export { ViewExam, EditAdminProfile,EditAdminPassword,AdminProfile, DefineDiscounts, ReportView, Followup, ReportProblem, ReportedProblems, CoursePreview, EditInstructorPassword ,EditTraineePassword, EditTraineeProfile, TraineeProfile, Register, Terms, PaymentDone, Forgot, Reset, Result, Exam, Index, AddUsers, AdminHome, TraineeCourses, AllCourses, TraineeHome, InstructorCourses, InstructorHome, CreateCourse, SingleCourseInstructor, SingleCourse, Rate, RatingList, CreateExam, InstructorVidView, UploadVideo, Discount, InstructorProfile, InstructorEditProfile, InstructorContract, StudentVidView};

