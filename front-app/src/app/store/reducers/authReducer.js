import { LOGIN, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_SUCCESS } from "../actions/types";

const initialState = {
  user: null,
  token: null,
  role: null,
  isLoading: false,
  isError: false,
};

export default function store(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOGIN:
      return {
        ...state,
        isLoading: true,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("learningAppUser", JSON.stringify(action.payload));
      localStorage.setItem("learningAppToken", action.token);
      return {
        ...state,
        user: payload,
        token: action.token,
        role: action.token.split(' ')[0],
        isLoading: false,
        isError: false,
      };
    case LOGIN_FAIL:
      localStorage.removeItem("learningAppUser");
      localStorage.removeItem("learningAppToken");
      return {
        ...state,
        user: null,
        token: null,
        role: null,
        isLoading: false,
        isError: true,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        user: null,
        token: null,
        role: null,
        isLoading: false,
        isError: false,
      }
    default:
      return state;
  }
}