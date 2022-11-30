import { combineReducers } from "redux";
import authReducer from "./authReducer.js";
import coursesReducer from "./coursesReducer";
import videosReducer from "./videosReducer";

export default combineReducers({
    auth: authReducer,
    courses: coursesReducer,
    videos: videosReducer,
});