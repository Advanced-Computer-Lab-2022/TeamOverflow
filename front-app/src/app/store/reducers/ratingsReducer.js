import { RATING, RATING_FAIL, RATING_SUCCESS } from "../actions/types";

const initialState = {
    ratings: null,
    isLoading: false,
    isError: false,
};

export default function store(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case RATING:
            return {
                ...state,
                isLoading: true,
            };
        case RATING_SUCCESS:
            return {
                ...state,
                ratings: payload,
                isLoading: false,
                isError: false,
            };
        case RATING_FAIL:
            return {
                ...state,
                ratings: null,
                isLoading: false,
                isError: true,
            };
        default:
            return state;
    }
}