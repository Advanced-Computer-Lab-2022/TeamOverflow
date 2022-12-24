import { CLEAR_REPORTS, REPORTS, REPORTS_FAIL, REPORTS_SUCCESS, SINGLE_REPORT_SUCCESS, SINGLE_REPORT_FAIL } from "../actions/types";

const initialState = {
    results: null,
    single: null,
    isLoading: false,
    isError: false
};

export default function store(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case REPORTS:
            return {
                ...state,
                isLoading: true,
                isError: false
            };
        case SINGLE_REPORT_SUCCESS:
            return {
                ...state,
                single: payload,
                isLoading: false,
                isError: false,
            };
        case REPORTS_SUCCESS:
            return {
                ...state,
                results: payload,
                single: null,
                isLoading: false,
                isError: false,
            };
        case SINGLE_REPORT_FAIL:
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        case REPORTS_FAIL:
            return {
                ...state,
                results: null,
                single: null,
                isLoading: false,
                isError: true,
            };
        case CLEAR_REPORTS:
            return {
                ...state,
                results: null,
                single: null,
                isLoading: false,
                isError: false,
            }
        default:
            return state;
    }
}