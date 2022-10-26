import { COURSE, SINGLE_COURSE_SUCCESS, COURSE_SUCCESS, COURSE_FAIL } from "./types";
import { getRequest, postRequest } from "../../../core/network";
import endpoints from "../../../constants/endPoints.json";
import { notification } from "antd";

export const searchCoursesUsers = (data) => (dispatch) => {
  dispatch({ type: COURSE });
  var { searchQuery, token } = data

  const info = {
    query: searchQuery,
  }

  getRequest(info, undefined, token, endpoints.course.searchUsers)
    .then((response) => {
      console.log(response)
      const { data } = response;
      return dispatch({
        type: COURSE_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: "Something Went Wrong" })
      console.log(err);
      return dispatch({
        type: COURSE_FAIL,
      });
    });
};

export const filterCoursesAll = (data) => (dispatch) => {
  dispatch({ type: COURSE });
  var { subject, minRating, maxRating, token } = data

  const info = {
    subject: subject,
    minRating: minRating,
    maxRating: maxRating
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
      notification.error({ message: "Something Went Wrong" })
      console.log(err);
      return dispatch({
        type: COURSE_FAIL,
      });
    });
};

export const filterCoursesPrice = (data) => (dispatch) => {
  dispatch({ type: COURSE });
  var { minPrice, maxPrice, token } = data

  const info = {
    minPrice: minPrice,
    maxPrice: maxPrice
  }

  getRequest(info, undefined, token, endpoints.course.filterPrice)
    .then((response) => {
      console.log(response)
      const { data } = response;
      return dispatch({
        type: COURSE_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: "Something Went Wrong" })
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
      notification.error({ message: "Something Went Wrong" })
      console.log(err);
      return dispatch({
        type: COURSE_FAIL,
      });
    });
};

export const viewPrices = (data) => (dispatch) => {
  dispatch({ type: COURSE });
  var { token } = data

  getRequest(undefined, undefined, token, endpoints.course.viewAllPrices)
    .then((response) => {
      console.log(response)
      const { data } = response;
      return dispatch({
        type: COURSE_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: "Something Went Wrong" })
      console.log(err);
      return dispatch({
        type: COURSE_FAIL,
      });
    });
};

export const viewTitlesInstructor = (data) => (dispatch) => {
  dispatch({ type: COURSE });
  var { token } = data

  getRequest(undefined, undefined, token, endpoints.course.viewInstructor)
    .then((response) => {
      console.log(response)
      const { data } = response;
      return dispatch({
        type: COURSE_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: "Something Went Wrong" })
      console.log(err);
      return dispatch({
        type: COURSE_FAIL,
      });
    });
};

export const filterCoursesInstructor = (data) => (dispatch) => {
  dispatch({ type: COURSE });
  var { subject, minPrice, maxPrice, token } = data

  const info = {
    subject: subject,
    minPrice: minPrice,
    maxPrice: maxPrice
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
      notification.error({ message: "Something Went Wrong" })
      console.log(err);
      return dispatch({
        type: COURSE_FAIL,
      });
    });
};

export const searchCoursesInstructor = (data) => (dispatch) => {
  dispatch({ type: COURSE });
  var { searchQuery, token } = data

  const info = {
    query: searchQuery,
  }

  getRequest(info, undefined, token, endpoints.course.searchInstructor)
    .then((response) => {
      console.log(response)
      const { data } = response;
      return dispatch({
        type: COURSE_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: "Something Went Wrong" })
      console.log(err);
      return dispatch({
        type: COURSE_FAIL,
      });
    });
};

