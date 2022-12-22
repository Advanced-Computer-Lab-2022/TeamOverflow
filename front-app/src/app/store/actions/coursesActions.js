import { COURSE, SINGLE_COURSE_SUCCESS, COURSE_SUCCESS, COURSE_FAIL, SUBJECT_SUCCESS } from "./types";
import { getRequest, postRequest } from "../../../core/network";
import endpoints from "../../../constants/endPoints.json";
import { notification } from "antd";

export const filterCoursesAll = (data) => (dispatch) => {
  dispatch({ type: COURSE });
  var { subject, minRating, maxRating, minPrice, maxPrice, searchQuery, token, page } = data

  const info = {
    subject: subject,
    minRating: minRating,
    maxRating: maxRating,
    minPrice: minPrice,
    maxPrice: maxPrice,
    searchQuery: searchQuery,
    page: page
  }

  getRequest(info, undefined, token, endpoints.course.filterUsers)
    .then((response) => {
      console.log(response)
      const { data } = response;
      return dispatch({
        type: COURSE_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: err.response.data.message })
      console.log(err);
      return dispatch({
        type: COURSE_FAIL,
      });
    });
};

export const viewCourse = (data) => (dispatch) => {
  dispatch({ type: COURSE });
  var { id, token } = data

  const info = {
    id: id
  }

  getRequest(info, undefined, token, endpoints.course.viewSingleCourse)
    .then((response) => {
      console.log(response)
      const { data } = response;
      return dispatch({
        type: SINGLE_COURSE_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: err.response.data.message })
      console.log(err);
      return dispatch({
        type: COURSE_FAIL,
      });
    });
};

export const filterCoursesInstructor = (data) => (dispatch) => {
  dispatch({ type: COURSE });
  var { subject, minPrice, maxPrice, searchQuery, page, token } = data

  const info = {
    subject: subject,
    minPrice: minPrice,
    maxPrice: maxPrice,
    searchQuery: searchQuery,
    page: page
  }

  getRequest(info, undefined, token, endpoints.course.filterInstructor)
    .then((response) => {
      console.log(response)
      const { data } = response;
      return dispatch({
        type: COURSE_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: err.response.data.message })
      console.log(err);
      return dispatch({
        type: COURSE_FAIL,
      });
    });
};

export const getSubjects = (data) => (dispatch) => {
  dispatch({ type: COURSE });

  getRequest(undefined, undefined, undefined, endpoints.course.getSubjects)
    .then((response) => {
      console.log(response)
      const { data } = response;
      return dispatch({
        type: SUBJECT_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: err.response.data.message })
      console.log(err);
      return dispatch({
        type: COURSE_FAIL,
      });
    });
};

export const getRegisteredCourses = (token) => (dispatch) => {
  dispatch({ type: COURSE });

  var role = token.split(" ")[0]
    var end = role === "Trainee" ? endpoints.trainee : endpoints.corporatetrainee

  getRequest(undefined, undefined, token, end.getRegisteredCourses)
    .then((response) => {
      console.log(response)
      const { data } = response;
      return dispatch({
        type: COURSE_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: err.response.data.message })
      console.log(err);
      return dispatch({
        type: COURSE_FAIL,
      });
    });
};

export const openCourse = (data) => (dispatch) => {
  dispatch({ type: COURSE });
  const {query, token} = data;

  var role = token.split(" ")[0]
    var end = role === "Trainee" ? endpoints.trainee : endpoints.corporatetrainee

  getRequest(query, undefined, token, end.openCourse)
    .then((response) => {
      console.log(response)
      const { data } = response;
      return dispatch({
        type: SINGLE_COURSE_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: err.response.data.message })
      console.log(err);
      return dispatch({
        type: COURSE_FAIL,
      });
    });
};
