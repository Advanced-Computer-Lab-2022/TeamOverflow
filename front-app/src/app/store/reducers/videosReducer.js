import { VIDEO, VIDEO_FAIL, VIDEO_SUCCESS } from "../actions/types";

const initialState = {
    video: null,
    isLoading: false,
    isError: false,
};

export default function store(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case VIDEO:
            return {
                ...state,
                isLoading: true,
            };
        case VIDEO_SUCCESS:
            return {
                ...state,
                video: payload,
                isLoading: false,
                isError: false,
            };
        case VIDEO_FAIL:
            return {
                ...state,
                video: null,
                isLoading: false,
                isError: true,
            };
        default:
            return state;
    }
}