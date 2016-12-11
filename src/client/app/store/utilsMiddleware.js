import * as utilsActions from '../actions/utils';

const {
  // SHOW_LOADING,
  // HIDE_LOADING,
  TOKEN_INVALIDATE// ,
  // TOAST
} = require('../constants/ActionTypes').default;
import { apiUnAuthMsg } from '../../../etc/config';
export default function utilsMiddleware({ dispatch }) {
  return next => action => {
    const { type } = action;
    if (!type) {
      return next(action);
    }

    if (type.indexOf('FAIL') > -1) {
      if (typeof action.error === 'object') {
        if (action.error.message === apiUnAuthMsg) {
          dispatch(utilsActions.showLoginPopUp())
        } else {
          dispatch(utilsActions.toast(action.error.message, 2000));
        }
      }
    }

    if (type === TOKEN_INVALIDATE) {
     // goToLogin();
    }

    next(action);
  }
}
