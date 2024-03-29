import { UPDATE_USER, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL, REGISTERING, REGISTERED, WAITING, WAITING_SUCCESS, WAITING_FAIL } from "./types";
import { getRequest, postRequest, putRequest } from "../../../core/network";
import endpoints from "../../../constants/endPoints.json";
import { notification } from "antd";

export const selectCountry = (data) => (dispatch) => {
  dispatch({ type: UPDATE_USER });
  var { country, token } = data

  postRequest({ country: country }, undefined, undefined, token, endpoints.trainee.setCountry)
    .then((response) => {
      console.log(response)
      const { data } = response;
      notification.success({ message: `${country} selected` })
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

export const editProfile = (data) => (dispatch) => {
  dispatch({ type: UPDATE_USER });
  var { edits, token } = data

  putRequest(edits, undefined, undefined, token, endpoints.trainee.editProfile)
    .then((response) => {
      const { data } = response;
      notification.success({ message: "Profile updated" })
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

export const getPaymentLink = (data) => (dispatch) => {
  dispatch({type: WAITING})
  var { courseId, fromWallet, token } = data

  getRequest({ courseId: courseId, fromWallet: fromWallet }, undefined, token, endpoints.trainee.getPaymentLink)
    .then((response) => {
      const { data } = response;
      dispatch({type: WAITING_SUCCESS})
      if(data.paymentUrl) {
        window.open(data.paymentUrl)
      } else {
        notification.success({message: data.message})
      }
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      dispatch({type: WAITING_FAIL})
    });
};

export const registerCourse = (data) => (dispatch) => {
  var { courseData, token } = data
  dispatch({type: REGISTERING})

  postRequest(courseData, undefined, undefined, token, endpoints.trainee.registercourse)
    .then((response) => {
      const { data } = response;
      dispatch({type: REGISTERED})
      return notification.success({ message: "Registration Successful" })
    })
    .catch((err) => {
      dispatch({type: WAITING_FAIL})
      return notification.error({ message: err?.response?.data?.message })
    });
};

export const requestRefund = (data, navigate) => (dispatch) => {
  var { courseData, token } = data

  postRequest(courseData, undefined, undefined, token, endpoints.trainee.requestRefund)
    .then((response) => {
      const { data } = response;
      navigate("/")
      return notification.success({ message: data.message })
    })
    .catch((err) => {
      return notification.error({ message: err?.response?.data?.message })
    });
};
