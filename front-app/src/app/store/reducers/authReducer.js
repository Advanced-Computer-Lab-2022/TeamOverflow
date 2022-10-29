import { LOGIN, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_SUCCESS, GUEST, UPDATE_USER, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL } from "../actions/types";

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  isError: false,
};

export default function store(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_USER:
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
        isLoading: false,
        isError: false,
      };
    case GUEST:
      return {
        ...state,
        user: {type: "Guest User"},
        token: "Guest x",
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
        isLoading: false,
        isError: true,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isError: false,
      }
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isError: false
      }
    case UPDATE_USER_FAIL:
      return{
        ...state,
        isError: true,
        isLoading: false
      }
    default:
      return state;
  }
}