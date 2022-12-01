import { RATING, RATING_SUCCESS, RATING_FAIL } from "./types";

import { postRequest } from "../../../core/network";
import endpoints from "../../../constants/endPoints.json";
import { notification } from "antd";

export const postRating = (data) => (dispatch) => {
    var { creation, token } = data
    var end
    if(creation.instructorId){
        end = endpoints.rate.rateInstructor
    } else {
        end = endpoints.rate.rateCourse
    }
    postRequest(creation, undefined, undefined, token, end)
        .then((response) => {
            console.log(response)
            notification.success({ message: "Rating Posted" })
        })
        .catch((err) => {
            notification.error({ message: err.message })
            console.log(err);
        });
};