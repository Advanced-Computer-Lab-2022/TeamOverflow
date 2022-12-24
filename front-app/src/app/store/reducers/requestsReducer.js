import { REQUESTS, REQUESTS_FAIL, REQUESTS_SUCCESS } from "../actions/types";

const initialState = {
    type: null,
    requests: null,
    isLoading: false,
    isError: false,
};

export default function store(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case REQUESTS:
            return {
                ...state,
                isLoading: true,
            };
        case REQUESTS_SUCCESS:
            return {
                ...state,
                type: payload.type,
                requests: payload.results,
                isLoading: false,
                isError: false,
            };
        case REQUESTS_FAIL:
            return {
                ...state,
                requests: null,
                isLoading: false,
                isError: true,
            };
        default:
            return state;
    }
}