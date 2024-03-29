import { RATING, RATING_SUCCESS, RATING_FAIL } from "./types";

import { postRequest, getRequest } from "../../../core/network";
import endpoints from "../../../constants/endPoints.json";
import { notification } from "antd";

export const postRating = (data) => (dispatch) => {
  var { creation, token } = data
  var end
  if (creation.instructorId) {
    end = endpoints.rate.rateInstructor
  } else {
    end = endpoints.rate.rateCourse
  }
  postRequest(creation, undefined, undefined, token, end)
    .then((response) => {
      console.log(response)
      notification.success({ message: "Rating Posted" })
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
    });
};

export const getInstructorRatings = (data) => (dispatch) => {
  dispatch({ type: RATING });

  getRequest({ page: data.page }, undefined, data.token, endpoints.instructor.viewRatings)
    .then((response) => {
      console.log(response)
      const { data } = response;
      return dispatch({
        type: RATING_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
      return dispatch({
        type: RATING_FAIL,
      });
    });
};

export const getCoursesRatings = (data) => (dispatch) => {
  dispatch({ type: RATING });

  getRequest({ page: data.page, courseId: data.courseId }, undefined, data.token, endpoints.instructor.viewCourseRatings)
    .then((response) => {
      console.log(response)
      const { data } = response;
      return dispatch({
        type: RATING_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
      return dispatch({
        type: RATING_FAIL,
      });
    });
};

export const viewInstructorRatings = (data) => (dispatch) => {
  dispatch({ type: RATING });

  getRequest({ page: data.page, instructorId: data.instructorId }, undefined, data.token, endpoints.rate.viewInstructorRatings)
    .then((response) => {
      console.log(response)
      const { data } = response;
      return dispatch({
        type: RATING_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
      return dispatch({
        type: RATING_FAIL,
      });
    });
};

export const viewCoursesRatings = (data) => (dispatch) => {
  dispatch({ type: RATING });

  getRequest({ page: data.page, courseId: data.courseId }, undefined, data.token, endpoints.rate.viewCourseRatings)
    .then((response) => {
      console.log(response)
      const { data } = response;
      return dispatch({
        type: RATING_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
      return dispatch({
        type: RATING_FAIL,
      });
    });
};