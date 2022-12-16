import { CONTRACT, CONTRACT_FAIL, CONTRACT_SUCCESS } from "../actions/types";

const initialState = {
    contract: null,
    isLoading: false,
    isError: false,
};

export default function store(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case CONTRACT:
            return {
                ...state,
                isLoading: true,
            };
        case CONTRACT_SUCCESS:
            return {
                ...state,
                contract: payload,
                isLoading: false,
                isError: false,
            };
        case CONTRACT_FAIL:
            return {
                ...state,
                contract: null,
                isLoading: false,
                isError: true,
            };
        default:
            return state;
    }
}