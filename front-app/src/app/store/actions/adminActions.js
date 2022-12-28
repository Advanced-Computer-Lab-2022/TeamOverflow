import {getRequest, postRequest, putRequest } from "../../../core/network";
import { CREATE, CREATE_SUCCESS, CREATE_FAIL, UPDATE_USER, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL, REQUESTS, REQUESTS_FAIL, REQUESTS_SUCCESS } from "./types";
import endpoints from "../../../constants/endPoints.json";
import { notification } from "antd";

export const addUser = (data, navigate) => (dispatch) => {
  dispatch({ type: CREATE });
  var { type, username, password, corporation, token } = data
  var end;
  switch (type) {
    case "Instructor": end = endpoints.auth.instructor.add; break;
    case "Admin": end = endpoints.auth.admin.add; break;
    case "Corporate": end = endpoints.auth.corporatetrainee.add; break;
    default: end = null;
  }

  const info = {
    username: username,
    password: password,
    corporation: corporation
  }

  postRequest(info, undefined, undefined, token, end)
    .then((response) => {
      console.log(response)
      const { data } = response;
      notification.success({ message: `${type} added` })
      navigate(-1)
      return dispatch({
        type: CREATE_SUCCESS,
        payload: data.payload,
        token: data.token
      });
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
      return dispatch({
        type: CREATE_FAIL,
      });
    });
};


export const editProfile = (data) => (dispatch) => {
  dispatch({ type: UPDATE_USER });
  var {edits, token} = data

  putRequest(edits, undefined, undefined, token, endpoints.admin.editProfile)
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

export const viewRefunds = (data) => (dispatch) => {
  dispatch({ type: REQUESTS });
  var { info, token } = data

  getRequest(info, undefined, token, endpoints.admin.viewRefunds)
    .then((response) => {
      const { data } = response;
      return dispatch({
        type: REQUESTS_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
      return dispatch({
        type: REQUESTS_FAIL,
      });
    });
};

      

export const respondRefund = (data) => (dispatch) => {
  dispatch({ type: REQUESTS });
  var { info, token } = data

  postRequest(info, undefined, undefined, token, endpoints.admin.respondRefund)
    .then((response) => {
      const { data } = response;
      notification.success({ message: data.message })
      return dispatch({
        type: REQUESTS_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
      return dispatch({
        type: REQUESTS_FAIL,
      });
    });
};

export const viewRequests = (data) => (dispatch) => {
  dispatch({ type: REQUESTS });
  var { info, token } = data

  getRequest(info, undefined, token, endpoints.admin.viewRequests)
    .then((response) => {
      const { data } = response;
      return dispatch({
        type: REQUESTS_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
      return dispatch({
        type: REQUESTS_FAIL,
      });
    });
};

export const respondRequest = (data) => (dispatch) => {
  dispatch({ type: REQUESTS });
  var { info, token } = data

  postRequest(info, undefined, undefined, token, endpoints.admin.grantAccess)
    .then((response) => {
      const { data } = response;
      notification.success({ message: data.message })
      return dispatch({
        type: REQUESTS_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
      return dispatch({
        type: REQUESTS_FAIL,
      });
    });
};

export const defineDiscount = (data) => (dispatch) => {
  var { info, token } = data

  postRequest(info, undefined, undefined, token, endpoints.admin.defineDiscount)
    .then((response) => {
      const { data } = response;
      notification.success({ message: data.message })
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
      return dispatch({
        type: REQUESTS_FAIL,
      });
    });
};

