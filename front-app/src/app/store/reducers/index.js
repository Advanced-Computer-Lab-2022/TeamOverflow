import { combineReducers } from "redux";
import authReducer from "./authReducer.js";
import coursesReducer from "./coursesReducer";
import videosReducer from "./videosReducer";
import ratingsReducer from "./ratingsReducer";
import examReducer from "./examReducer";
import contractReducer from "./contractReducer";
import reportsReducer from "./reportsReducer";

export default combineReducers({
    auth: authReducer,
    courses: coursesReducer,
    videos: videosReducer,
    ratings: ratingsReducer,
    exercise: examReducer,
    contract: contractReducer,
    reports: reportsReducer,
});