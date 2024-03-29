import { VIDEO, VIDEO_SUCCESS, VIDEO_FAIL } from "./types";
import { postRequest, getRequest } from "../../../core/network";
import endpoints from "../../../constants/endPoints.json";
import { notification } from "antd";
import download from "downloadjs"

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
      notification.error({ message: err.response.data.message })
      console.log(err);
      return dispatch({
        type: VIDEO_FAIL,
      });
    });
};

export const uploadVideo = (data, navigate) => (dispatch) => {
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
      navigate(-1)
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
    });
};

export const getRegVideo = (data) => (dispatch) => {
  dispatch({ type: VIDEO });
  const { query, token } = data;

  var role = token.split(" ")[0]
  var end = role === "Trainee" ? endpoints.trainee : endpoints.corporatetrainee

  getRequest(query, undefined, token, end.watchVideo)
    .then((response) => {
      const { data } = response;
      return dispatch({
        type: VIDEO_SUCCESS,
        payload: data
      });
    })
    .catch((err) => {
      notification.error({ message: err.response.data.message })
      console.log(err);
      return dispatch({
        type: VIDEO_FAIL,
      });
    });
};

export const addNote = (data) => (dispatch) => {
  var { creation, token } = data
  const role = token.split(" ")[0]
  var end;

  switch (role) {
    case "Corporate": end = endpoints.corporatetrainee.addNote; break;
    case "Trainee": end = endpoints.trainee.addNote; break;
    default: break;
  }

  postRequest(creation, undefined, undefined, token, end)
    .then((response) => {
      console.log(response)
      notification.success({ message: "Note Added" })
    })
    .catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
    });
};

export const downloadNotes = (data) => (dispatch) => {
  var { videoId, token } = data
  const role = token.split(" ")[0]
  var end;

  switch (role) {
    case "Corporate": end = endpoints.corporatetrainee.downloadNotes; break;
    case "Trainee": end = endpoints.trainee.downloadNotes; break;
    default: break;
  }

  getRequest({ videoId: videoId, responseType: 'blob' }, undefined, token, end)
    .then((response) => {
      console.log(response.headers)
      download(response.data, response.headers["filename"], response.headers.getContentType)
      notification.success({ message: "Note Downloaded" })
    }).catch((err) => {
      notification.error({ message: err?.response?.data?.message })
      console.log(err);
    });
};

