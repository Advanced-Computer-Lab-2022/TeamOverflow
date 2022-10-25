import { combineReducers } from "redux";
import authReducer from "./authReducer.js";
import coursesReducer from "./coursesReducer";

export default combineReducers({
    auth: authReducer,
    courses: coursesReducer
});