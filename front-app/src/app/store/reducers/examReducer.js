import { EXAM, EXAM_FAIL, EXAM_SUCCESS } from "../actions/types";

const initialState = {
    exam: null,
    isLoading: false,
    isError: false,
};

export default function store(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case EXAM:
            return {
                ...state,
                isLoading: true,
            };
        case EXAM_SUCCESS:
            return {
                ...state,
                exam: payload,
                isLoading: false,
                isError: false,
            };
        case EXAM_FAIL:
            return {
                ...state,
                exam: null,
                isLoading: false,
                isError: true,
            };
        default:
            return state;
    }
}