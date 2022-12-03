import { EXAM, EXAM_SUCCESS, EXAM_FAIL } from "./types";
import { postRequest, getRequest, putRequest } from "../../../core/network";
import endpoints from "../../../constants/endPoints.json";
import { notification } from "antd";

export const getExam = (data) => (dispatch) => {
    dispatch({ type: EXAM });
    const { token, query } = data;

    var role = token.split(" ")[0]
    var end = role === "Trainee" ? endpoints.trainee : endpoints.corporatetrainee

    getRequest(query, undefined, token, end.openExam)
        .then((response) => {
            const { data } = response;
            return dispatch({
                type: EXAM_SUCCESS,
                payload: data
            });
        })
        .catch((err) => {
            notification.error({ message: "Something Went Wrong" })
            console.log(err);
            return dispatch({
                type: EXAM_FAIL,
            });
        });
};

export const submitSolution = (data) => (dispatch) => {
    dispatch({ type: EXAM });
    var { solution, token } = data

    var role = token.split(" ")[0]
    var end = role === "Trainee" ? endpoints.trainee : endpoints.corporatetrainee

    postRequest(solution, undefined, undefined, token, end.submitSolution)
        .then((response) => {
            notification.success({ message: response })
        })
        .catch((err) => {
            notification.error({ message: err.message })
            console.log(err);
        });
};

export const getGrade = (data) => (dispatch) => {
    dispatch({ type: EXAM });
    var { query, token } = data

    var role = token.split(" ")[0]
    var end = role === "Trainee" ? endpoints.trainee : endpoints.corporatetrainee

    getRequest(query, undefined, token, end.getGrade)
        .then((response) => {
            const { data } = response;
            return dispatch({
                type: EXAM_SUCCESS,
                payload: data
            });
        })
        .catch((err) => {
            notification.error({ message: err.message })
            console.log(err);
            return dispatch({
                type: EXAM_FAIL,
            });
        });
};
