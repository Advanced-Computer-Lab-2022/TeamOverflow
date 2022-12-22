import { UPDATE_USER, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL } from "./types";
import { postRequest, putRequest } from "../../../core/network";
import endpoints from "../../../constants/endPoints.json";
import { notification } from "antd";

export const selectCountry = (data) => (dispatch) => {
  dispatch({ type: UPDATE_USER });
  var {country, token} = data

  postRequest({country: country}, undefined, undefined, token, endpoints.trainee.setCountry)
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
      notification.error({message: err.response.data.message})
      console.log(err);
      return dispatch({
        type: UPDATE_USER_FAIL,
      });
    });
};

export const editProfile = (data) => (dispatch) => {
  dispatch({ type: UPDATE_USER });
  var {edits, token} = data

  putRequest(edits, undefined, undefined, token, endpoints.trainee.editProfile)
    .then((response) => {
      const { data } = response;
      notification.success({message: "Profile updated"})
      return dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({message: err.response.data.message})
      console.log(err);
      return dispatch({
        type: UPDATE_USER_FAIL,
      });
    });
  };
    export const registerCourse = (data) =>  {
    
      var {courseData, token} = data
      
      postRequest(courseData, undefined, undefined, token, endpoints.trainee.registercourse)
        .then((response) => {
          const { data } = response;
          notification.success({message: "successful registrations "})
         
        })
        .catch((err) => {
          notification.error({message: err.response.data.message})
      console.log(err);
        
        });
      };
