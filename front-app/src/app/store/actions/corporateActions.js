import { UPDATE_USER, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL } from "./types";
import { postRequest, putRequest } from "../../../core/network";
import endpoints from "../../../constants/endPoints.json";
import { notification } from "antd";

export const selectCountry = (data) => (dispatch) => {
  dispatch({ type: UPDATE_USER });
  var {country, token} = data

  postRequest({country: country}, undefined, undefined, token, endpoints.corporatetrainee.setCountry)
    .then((response) => {
      console.log(response)
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

export const requestAccess = (data) => (dispatch) => {
  dispatch({ type: UPDATE_USER });
  var {courseId, token} = data

  postRequest({courseId: courseId}, undefined, undefined, token, endpoints.corporatetrainee.requestAccess)
    .then((response) => {
      console.log(response)
      const { data } = response;
      notification.success({message: data.message})
    })
    .catch((err) => {
      notification.error({message: err?.response?.data?.message})
      console.log(err);
    });
};

export const editProfile = (data) => (dispatch) => {
  dispatch({ type: UPDATE_USER });
  var { edits, token } = data

  putRequest(edits, undefined, undefined, token, endpoints.corporatetrainee.editProfile)
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

export const acceptTerms = (token, navigate) => (dispatch) => {
  dispatch({ type: UPDATE_USER });

  putRequest(undefined, undefined, undefined, token, endpoints.corporatetrainee.acceptTerms)
    .then((response) => {
      const { data } = response;
      notification.success({ message: "Accepted Terms and Conditions" })
      navigate("/")
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