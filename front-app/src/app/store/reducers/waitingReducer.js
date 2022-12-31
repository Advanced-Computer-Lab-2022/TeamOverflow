import { WAITING, WAITING_FAIL, WAITING_SUCCESS } from "../actions/types";

const initialState = {
    isLoading: false,
    isError: false,
};

export default function store(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case WAITING:
            return {
                ...state,
                isLoading: true,
            };
        case WAITING_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isError: false,
            };
        case WAITING_FAIL:
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        default:
            return state;
    }
}