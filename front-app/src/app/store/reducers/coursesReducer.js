import { COURSE, COURSE_FAIL, COURSE_SUCCESS, SINGLE_COURSE_SUCCESS } from "../actions/types";

const initialState = {
    results: null,
    single: null,
    isLoading: false,
    isError: false,
};

export default function store(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case COURSE:
            return {
                ...state,
                isLoading: true,
            };
        case SINGLE_COURSE_SUCCESS:
            return {
                ...state,
                single: payload,
                isLoading: false,
                isError: false,
            };
        case COURSE_SUCCESS:
            return {
                ...state,
                results: payload,
                single: null,
                isLoading: false,
                isError: false,
            };
        case COURSE_FAIL:
            return {
                ...state,
                results: null,
                single: null,
                isLoading: false,
                isError: true,
            };
        default:
            return state;
    }
}