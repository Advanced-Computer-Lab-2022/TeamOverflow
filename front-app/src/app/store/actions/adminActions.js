import { CREATE, CREATE_SUCCESS, CREATE_FAIL, UPDATE_USER, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL } from "./types";
import { postRequest, putRequest } from "../../../core/network";
import endpoints from "../../../constants/endPoints.json";
import { notification } from "antd";

export const addUser = (data) => (dispatch) => {
  dispatch({ type: CREATE });
  var {type, username, password, corporation, token} = data
  var end;
  switch(type) {
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
      notification.success({message: `${type} added`})
      return dispatch({
        type: CREATE_SUCCESS,
        payload: data.payload,
        token: data.token
      });
    })
    .catch((err) => {
      notification.error({message: err?.response?.data?.message})
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
