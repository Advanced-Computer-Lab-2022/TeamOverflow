import { VIDEO, VIDEO_SUCCESS, VIDEO_FAIL } from "./types";
import { postRequest, getRequest } from "../../../core/network";
import endpoints from "../../../constants/endPoints.json";
import { notification } from "antd";


export const getVideo = (videoId) => (dispatch) => {
  dispatch({ type: VIDEO });

  getRequest({ videoId: videoId }, undefined, undefined, endpoints.instructor.getVideo)
    .then((response) => {
      console.log(response)
      const { data } = response;
      return dispatch({
        type: VIDEO_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: "Failed to retrieve video" })
      console.log(err);
      return dispatch({
        type: VIDEO_FAIL,
      });
    });
};

export const uploadVideo = (data) => (dispatch) => {
  var { creation, token } = data
  var end;
  if (creation.subtitleId) {
    end = endpoints.instructor.uploadSubVid
  } else {
    end = endpoints.instructor.uploadCourseVid
  }

  postRequest(creation, undefined, undefined, token, end)
    .then((response) => {
      console.log(response)
      notification.success({ message: "Video Added" })
    })
    .catch((err) => {
      notification.error({ message: err.message })
      console.log(err);
    });
};