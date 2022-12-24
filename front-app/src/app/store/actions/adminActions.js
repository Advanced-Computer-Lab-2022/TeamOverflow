import { CREATE, CREATE_SUCCESS, CREATE_FAIL } from "./types";
import { postRequest } from "../../../core/network";
import endpoints from "../../../constants/endPoints.json";
import { notification } from "antd";

export const addUser = (data, navigate) => (dispatch) => {
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
      navigate(-1)
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