import { UPDATE_USER, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL } from "./types";
import { COURSE, COURSE_SUCCESS, COURSE_FAIL, SUBJECT_SUCCESS } from "./types";
import { CONTRACT, CONTRACT_SUCCESS, CONTRACT_FAIL } from "./types";

import { postRequest, putRequest, getRequest } from "../../../core/network";
import endpoints from "../../../constants/endPoints.json";
import { notification } from "antd";

export const selectCountry = (data) => (dispatch) => {
  dispatch({ type: UPDATE_USER });
  var {country, token} = data

  postRequest({country: country}, undefined, undefined, token, endpoints.instructor.setCountry)
    .then((response) => {
      const { data } = response;
      notification.success({message: `${country} selected`})
      return dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({message: err?.response?.data?.message})
      console.log(err);
      return dispatch({
        type: UPDATE_USER_FAIL,
      });
    });
};

export const editProfile = (data) => (dispatch) => {
  dispatch({ type: UPDATE_USER });
  var {edits, token} = data

  putRequest(edits, undefined, undefined, token, endpoints.instructor.editProfile)
    .then((response) => {
      const { data } = response;
      notification.success({message: "Profile updated"})
      return dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({message: err?.response?.data?.message})
      console.log(err);
      return dispatch({
        type: UPDATE_USER_FAIL,
      });
    });
};

export const createCourse = (data) => (dispatch) => {
  dispatch({ type: COURSE });
  var {creation, token} = data

  postRequest(creation, undefined, undefined, token, endpoints.instructor.createCourse)
    .then((response) => {
      console.log(response)
      const { data } = response;
      notification.success({message: "Course Added"})
      return dispatch({
        type: COURSE_SUCCESS,
        payload: data.payload
      });
    })
    .catch((err) => {
      notification.error({message: err?.response?.data?.message})
      console.log(err);
      return dispatch({
        type: COURSE_FAIL,
      });
    });
};

export const createExercise = (data) => (dispatch) => {
  var {creation, token} = data
  var end;
  if(creation.subtitleId){
    end = endpoints.instructor.createExercise
  } else {
    end = endpoints.instructor.createExam
  }
  postRequest(creation, undefined, undefined, token, end)
    .then((response) => {
      console.log(response)
      notification.success({message: "Exercise Added"})
    })
    .catch((err) => {
      notification.error({message: err?.response?.data?.message})
      console.log(err);
    });
};

export const defineDiscount = (data) => (dispatch) => {
  var {creation, token} = data

  postRequest(creation, undefined, undefined, token, endpoints.instructor.defineDiscount)
    .then((response) => {
      console.log(response)
      notification.success({message: "Discount Added"})
    })
    .catch((err) => {
      notification.error({message: err?.response?.data?.message})
      console.log(err);
    });
};

export const contractResponse = (data) => (dispatch) => {
  dispatch({ type: CONTRACT });
  var {edits, token} = data

  putRequest(edits, undefined, undefined, token, endpoints.instructor.respondContract)
    .then((response) => {
      const { data } = response;
      notification.success({message: "Contract updated"})
      return dispatch({
        type: CONTRACT_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({message: err?.response?.data?.message})
      console.log(err);
      return dispatch({
        type: CONTRACT_FAIL,
      });
    });
};

export const getContract = (token) => (dispatch) => {
  dispatch({ type: CONTRACT });

  getRequest(undefined, undefined, token, endpoints.instructor.getContract)
    .then((response) => {
      const { data } = response;
      return dispatch({
        type: CONTRACT_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({message: err?.response?.data?.message})
      console.log(err);
      return dispatch({
        type: CONTRACT_FAIL,
      });
    });
};