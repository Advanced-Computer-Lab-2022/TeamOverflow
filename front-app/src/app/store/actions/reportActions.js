import { REPORTS, REPORTS_SUCCESS, REPORTS_FAIL, SINGLE_REPORT_SUCCESS, SINGLE_REPORT_FAIL, CLEAR_REPORTS } from "./types";
import { getRequest, postRequest, putRequest } from "../../../core/network";
import endpoints from "../../../constants/endPoints.json";
import { notification } from "antd";

export const clearReports = () => (dispatch) => {
    dispatch({ type: CLEAR_REPORTS });
}

export const viewReports = (data) => (dispatch) => {
    dispatch({ type: REPORTS });

    const query = {
        type: data.type,
        status: data.status,
        page: data.page
    }

    const role = data.token.split(" ")[0]
    var end;
    switch (role) {
        case "Instructor": end = endpoints.instructor; break;
        case "Corporate": end = endpoints.corporatetrainee; break;
        case "Trainee": end = endpoints.trainee; break;
        case "Admin": end = endpoints.admin; break;
        default: break;
    }

    getRequest(query, undefined, data.token, end.viewReports)
        .then((response) => {
            const { data } = response;
            return dispatch({
                type: REPORTS_SUCCESS,
                payload: data
            });
        })
        .catch((err) => {
            notification.error({ message: err?.response?.data?.message })
            console.log(err);
            return dispatch({
                type: REPORTS_FAIL,
            });
        });
};

export const viewFollowups = (data) => (dispatch) => {
    dispatch({ type: REPORTS });
    var { query, token } = data

    const role = token.split(" ")[0]
    var end;
    switch (role) {
        case "Instructor": end = endpoints.instructor; break;
        case "Corporate": end = endpoints.corporatetrainee; break;
        case "Trainee": end = endpoints.trainee; break;
        case "Admin": end = endpoints.admin; break;
        default: break;
    }

    getRequest(query, undefined, token, end.viewFollowups)
        .then((response) => {
            const { data } = response;
            return dispatch({
                type: SINGLE_REPORT_SUCCESS,
                payload: data
            });
        })
        .catch((err) => {
            notification.error({ message: err?.response?.data?.message })
            console.log(err);
            return dispatch({
                type: SINGLE_REPORT_FAIL,
            });
        });
};

export const reportProblem = (data, navigate) => (dispatch) => {
    dispatch({ type: REPORTS });
    var { creation, token } = data

    const role = token.split(" ")[0]
    var end;
    switch (role) {
        case "Instructor": end = endpoints.instructor; break;
        case "Corporate": end = endpoints.corporatetrainee; break;
        case "Trainee": end = endpoints.trainee; break;
        default: break;
    }

    postRequest(creation, undefined, undefined, token, end.reportProblem)
        .then((response) => {
            const { data } = response;
            notification.success({ message: data.message })
            navigate && navigate(-1)
        })
        .catch((err) => {
            notification.error({ message: err?.response?.data?.message })
            console.log(err);
        });
};

export const addFollowup = (data, navigate) => (dispatch) => {
    dispatch({ type: REPORTS });
    var { creation, token } = data

    const role = token.split(" ")[0]
    var end;
    switch (role) {
        case "Instructor": end = endpoints.instructor; break;
        case "Corporate": end = endpoints.corporatetrainee; break;
        case "Trainee": end = endpoints.trainee; break;
        default: break;
    }

    postRequest(creation, undefined, undefined, token, end.addFollowup)
        .then((response) => {
            const { data } = response;
            notification.success({ message: data.message })
            navigate(-1)
        })
        .catch((err) => {
            notification.error({ message: err?.response?.data?.message })
            console.log(err);
        });
};

export const respondReport = (data, navigate) => (dispatch) => {
    dispatch({ type: REPORTS });
    var { info, token } = data

    postRequest(info, undefined, undefined, token, endpoints.admin.respondReport)
        .then((response) => {
            const { data } = response;
            notification.success({ message: "Responded to report" })
            return dispatch({
                type: SINGLE_REPORT_SUCCESS,
                payload: data
            });
        })
        .catch((err) => {
            notification.error({ message: err?.response?.data?.message })
            console.log(err);
            return dispatch({
                type: SINGLE_REPORT_FAIL,
            });
        });
};