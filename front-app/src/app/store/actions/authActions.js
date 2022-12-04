import { LOGIN, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, GUEST } from "./types";
import { getRequest, postRequest, putRequest } from "../../../core/network";
import endpoints from "../../../constants/endPoints.json";
import { notification } from "antd";

export const loadUser = () => async (dispatch, getState) => {
  dispatch({
    type: LOGIN,
  });
  let user = localStorage.getItem("learningAppUser");

  if (user) {
    user = JSON.parse(user);
    console.log("user", user);
    return dispatch({
      type: LOGIN_SUCCESS,
      payload: user,
      token: localStorage.getItem("learningAppToken")
    });
  } else {
    return dispatch({
      type: LOGIN_FAIL,
    });
  }
};

export const logout = () => async (dispatch, getState) => {
  localStorage.removeItem("learningAppUser");
  return dispatch({
    type: LOGOUT_SUCCESS,
  });
};

export const LoginUser = (data) => (dispatch) => {
  dispatch({ type: LOGIN });
  var end;
  switch(data.type) {
    case "Instructor": end = endpoints.auth.instructor.login; break;
    case "Admin": end = endpoints.auth.admin.login; break;
    case "Corporate": end = endpoints.auth.corporatetrainee.login; break;
    case "Trainee": end = endpoints.auth.trainee.login; break;
    default: end = null;
  }

  const info = {
    username: data.username,
    password: data.password
  }

  postRequest(info, undefined, undefined, undefined, end)
    .then((response) => {
      console.log(response)
      const { data } = response;
      return dispatch({
        type: LOGIN_SUCCESS,
        payload: data.payload,
        token: data.token
      });
    })
    .catch((err) => {
      notification.error({message: err.response.data.message})
      console.log(err);
      return dispatch({
        type: LOGIN_FAIL,
      });
    });
};

export const forgotPassword = (data) => (dispatch) => {

  getRequest(data, undefined, undefined, endpoints.auth.forgot)
    .then((response) => {
      const {data} = response;
      notification.success(data)
    })
    .catch((err) => {
      notification.error({message: err.response.data.message})
      console.log(err);
    });
};

export const resetPassword = (data) => (dispatch) => {

  putRequest(data, undefined, undefined, undefined, endpoints.auth.reset)
    .then((response) => {
      const {data} = response;
      notification.success(data)
    })
    .catch((err) => {
      notification.error({message: err.response.data.message})
      console.log(err);
    });
};

export const guestVisit = (data) => (dispatch) => {
  dispatch({ type: GUEST });
}