import { TERMS, WALLET, WALLET_SUCCESS, WALLET_FAIL, LOGIN, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, GUEST, CREATE, CREATE_FAIL, CREATE_SUCCESS, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL } from "./types";
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

export const createUser = (data) => (dispatch) => {

  dispatch({
    type: CREATE,
  });

  var end;
  end = endpoints.trainee.register;
  const info = {
    username: data.username,
    password: data.password,
    corporation: data.corporation,
    name: data.firstName + " " + data.lastName,
    email: data.email,
    gender: data.gender,
    country: data.country,
    acceptedTerms: data.acceptedTerms
  }

  postRequest(info, undefined, undefined, undefined, end)
    .then((response) => {
      console.log(response)
      notification.success({ message: "User has been created." })
      return dispatch({
        type: CREATE_SUCCESS,
      });
    })
    .catch((err) => {
      notification.error({ message: "User already exists." })
      console.log(err);
      return dispatch({
        type: CREATE_FAIL,
      });
    });


}

export const logout = () => async (dispatch, getState) => {
  localStorage.removeItem("learningAppUser");
  return dispatch({
    type: LOGOUT_SUCCESS,
  });
};

export const LoginUser = (data) => (dispatch) => {
  dispatch({ type: LOGIN });
  var end;
  switch (data.type) {
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
      if (response.data.message === "Success") {
        notification.success({ message: "Welcome Back" })
      } else {
        notification.error({ message: response.data.message })
      }
      const { data } = response;
      return dispatch({
        type: LOGIN_SUCCESS,
        payload: data.payload,
        token: data.token
      });
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
      return dispatch({
        type: LOGIN_FAIL,
      });
    });
};

export const forgotPassword = (data) => (dispatch) => {

  getRequest(data, undefined, undefined, endpoints.auth.forgot)
    .then((response) => {
      const { data } = response;
      notification.success(data)
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
    });
};

export const resetPassword = (data) => (dispatch) => {

  putRequest(data, undefined, undefined, undefined, endpoints.auth.reset)
    .then((response) => {
      const { data } = response;
      notification.success(data)
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
    });
};

export const getTerms = (data) => (dispatch) => {

  getRequest( undefined, undefined, undefined, endpoints.auth.terms)
    .then((response) => {
      const { data } = response;
      return dispatch({
        type: TERMS,
        payload: data
      })
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
    });
};

export const changePassword = (data) => (dispatch) => {

  var { token } = data;

  putRequest(data, undefined, undefined, token, endpoints.auth.change)
    .then((response) => {
      const { data } = response;
      notification.success(data)
      return dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: data
      });

    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
      return dispatch({
        type: UPDATE_USER_FAIL,
      });

    });
};

export const getWallet = (token) => (dispatch) => {

  dispatch({ type: WALLET })

  const role = token.split(" ")[0];
  var end;
  switch (role) {
    case "Trainee": end = endpoints.trainee.getWallet; break;
    case "Instructor": end = endpoints.instructor.getWallet; break;
    default: break;
  }

  getRequest(undefined, undefined, token, end)
    .then((response) => {
      const { data } = response;
      return dispatch({
        type: WALLET_SUCCESS,
        payload: data
      });

    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
      return dispatch({
        type: WALLET_FAIL,
      });

    });
};

export const guestVisit = (data) => (dispatch) => {
  dispatch({ type: GUEST });
}