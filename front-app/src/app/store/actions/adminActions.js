import {getRequest, postRequest, putRequest } from "../../../core/network";
import { CREATE, CREATE_SUCCESS, CREATE_FAIL, UPDATE_USER, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL, REQUESTS, REQUESTS_FAIL, REQUESTS_SUCCESS, CORPORATIONS, CORPORATIONS_SUCCESS, CORPORATIONS_FAIL, WAITING, WAITING_SUCCESS, WAITING_FAIL } from "./types";
import endpoints from "../../../constants/endPoints.json";
import { notification } from "antd";

export const addUser = (data, navigate) => (dispatch) => {
  dispatch({ type: CREATE });
  var { type, username, password, name, email, corporation, token } = data
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
    email: email,
    name: name,
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

export const addUsers = (data, navigate) => (dispatch) => {
  dispatch({ type: CREATE });
  var { token } = data

  postRequest(data, undefined, undefined, token, endpoints.auth.admin.addMany)
    .then((response) => {
      const { data } = response;
      console.log(data)
      notification.success({ message: data.message })
      navigate(-1)
      return dispatch({
        type: CREATE_SUCCESS,
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

export const acceptRefund = (data) => (dispatch) => {
  dispatch({ type: REQUESTS });
  var { info, token } = data

  postRequest(info, undefined, undefined, token, endpoints.admin.acceptRefund)
    .then((response) => {
      const { data } = response;
      notification.success({ message: "Refund Accepted" })
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

export const rejectRefund = (data) => (dispatch) => {
  dispatch({ type: REQUESTS });
  var { info, token } = data

  postRequest(info, undefined, undefined, token, endpoints.admin.rejectRefund)
    .then((response) => {
      const { data } = response;
      notification.success({ message: "Refund Rejected" })
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

export const acceptRequest = (data) => (dispatch) => {
  dispatch({ type: REQUESTS });
  var { info, token } = data

  postRequest(info, undefined, undefined, token, endpoints.admin.grantAccess)
    .then((response) => {
      const { data } = response;
      notification.success({ message: "Request Accepted" })
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

export const rejectRequest = (data) => (dispatch) => {
  dispatch({ type: REQUESTS });
  var { info, token } = data

  postRequest(info, undefined, undefined, token, endpoints.admin.rejectAccess)
    .then((response) => {
      const { data } = response;
      notification.success({ message: "Request Rejected" })
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
  dispatch({type: WAITING})
  var { info, token } = data

  postRequest(info, undefined, undefined, token, endpoints.admin.defineDiscount)
    .then((response) => {
      const { data } = response;
      notification.success({ message: data.message })
      dispatch({type: WAITING_SUCCESS})
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
      dispatch({type: WAITING_FAIL})
    });
};

export const addAccess = (data) => (dispatch) => {
  dispatch({type: WAITING})
  var { info, token } = data

  postRequest(info, undefined, undefined, token, endpoints.admin.addAccess)
    .then((response) => {
      const { data } = response;
      notification.success({ message: data.message })
      dispatch({type: WAITING_SUCCESS})
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
      dispatch({type: WAITING_FAIL})
    });
};

export const getCorporations = (token) => (dispatch) => {

  dispatch({
    type: CORPORATIONS
  })

  getRequest(undefined, undefined, token, endpoints.admin.getCorporations)
    .then((response) => {
      const { data } = response;
      dispatch({
        type: CORPORATIONS_SUCCESS,
        payload: data
      })
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
      return dispatch({
        type: CORPORATIONS_FAIL
      })
    });
};