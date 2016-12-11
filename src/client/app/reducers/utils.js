const {
  TOAST,
  RESIZE,
  SHOW_LOADING,
  HIDE_LOADING,
  PAGE_REFRESH_FLAG,
  TOKEN_INVALIDATE,
  TOKEN_SET
} = require('../constants/ActionTypes').default;

const initialState = {
  resize: {
    id: null
  },
  toast: {
    text: null,
    timeout: 2000,
    id: null
  },
  token: null,
  refreshFlag: false,
  showLoading: false
};

export default function (state = initialState, action) {
  const { payload } = action;

  switch (action.type) {
    case TOAST:
      return {
        ...state,
        toast: {
          ...state.toast,
          ...payload
        }
      };
    case RESIZE:
      return {
        ...state,
        resize: {
          ...state.resize,
          ...payload
        }
      };
    case SHOW_LOADING:
      return {
        ...state,
        showLoading: true
      };
    case HIDE_LOADING:
      return {
        ...state,
        showLoading: false
      };
    case PAGE_REFRESH_FLAG:
      return {
        ...state,
        refreshFlag: payload
      }
    case TOKEN_INVALIDATE:
      return {
        ...state,
        token: null
      }
    case TOKEN_SET:
      return {
        ...state,
        token: action.token
      }
    default :
      return state;
  }
}
