import { WALLET, WALLET_FAIL, WALLET_SUCCESS, LOGIN, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_SUCCESS, GUEST, UPDATE_USER, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL, CREATE, CREATE_FAIL, CREATE_SUCCESS, TERMS } from "../actions/types";

const initialState = {
  user: null,
  wallet: null,
  token: null,
  isLoading: false,
  isError: false,
  terms: null
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
        terms:null
      };
    case GUEST:
      return {
        ...state,
        user: { type: "Guest User" },
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
      localStorage.setItem("learningAppUser", JSON.stringify(action.payload));
      return {
        ...state,
        user: payload,
        isLoading: false,
        isError: false
      }
    case WALLET:
    case CREATE:
      return {
        ...state,
        isLoading: true,
        isError: false
      }
    case WALLET_SUCCESS:
      return {
        ...state,
        wallet: payload,
        isLoading: false,
        isError: false
      }
    case CREATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        terms:null
      }
    case UPDATE_USER_FAIL:
    case WALLET_FAIL:
    case CREATE_FAIL:
      return {
        ...state,
        isLoading: false,
        isError: true
      }
    case TERMS:
      return {
        ...state,
        terms: payload
      }
    default:
      return state;
  }
}