'use strict';
import { createAction } from 'redux-actions';

const {
  TOAST,
  RESIZE,
  SHOW_LOADING,
  HIDE_LOADING,
  TOKEN_INVALIDATE,
  TOKEN_SET
} = require('../constants/ActionTypes').default;

export const toast = createAction(TOAST, (text, timeout) => {
  if (!text) text = '网络异常，请稍后再试！';
  return {
    text,
    timeout,
    id: new Date().getTime()
  }
})

export const resize = createAction(RESIZE, () => {
  return {
    id: new Date().getTime()
  }
})

export function showLoading() {
  return {
    type: SHOW_LOADING
  }
}

export function hideLoading() {
  return {
    type: HIDE_LOADING
  }
}

export function tokenInvalidate() {
  return {
    type: TOKEN_INVALIDATE
  }
}

export function tokenSet(token) {
  return {
    type: TOKEN_SET,
    token: token
  }
}

/*
 * 返回其他页面 是否需要刷新
 */
export function pageRefreshFlag(flag) {
  return dispatch => {
    dispatch({
      type: PAGE_REFRESH_FLAG,
      payload: flag
    })
  }
}
