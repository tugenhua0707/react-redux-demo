const {
  BBSLIST_INIT_SUCCESS,
  BBSLIST_INIT_FAIL
} = require('../constants/ActionTypes').default;
import { showLoading, hideLoading } from './utils';

import * as homeService from '../services/bbslist';

export function index(param, header, filter) {
  return dispatch => {
    dispatch(showLoading())
    homeService.req.index(param, header, filter).then(data => {
      dispatch(hideLoading())
      dispatch({
        type: BBSLIST_INIT_SUCCESS,
        data: data,
        pageNo: param.pageNo
      });
    }).catch(error => {
      dispatch(hideLoading())
      dispatch({
        type: BBSLIST_INIT_FAIL,
        error: error
      });
    })
  }
}

