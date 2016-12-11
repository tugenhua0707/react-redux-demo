import queryString from 'query-string';
require('es6-promise').polyfill();
require('isomorphic-fetch');

import config from '../../../etc/config';
// let config = require('../../../etc/config').default;

function filterStatus(res) {
  if (res.status >= 0xc8 && res.status < 0x12c) {
    return res
  }
  const error = new Error(config.apiErrorMsg || res.statusText);
  error.res = res;
  error.type = 'http';
  throw error;
}

function filterJSON(res) {
  return res.json();
}

function filterCode(json) {
  //console.log(json)
  if (json && json.code === 0) {
    return json.data === undefined ? {} : json.data;
  }
  if (json.code === 10) {
    throw new Error(config.apiUnAuthMsg || json.errorMsg);
  } else {
    throw new Error(json.errorMsg);
  }
}

function _fetch (fetchPromise, timeout) {
  var abortFn = null;
  // 这是一个可以被reject的promise
  var abortPromise = new Promise(function(resolve, reject) {
    abortFn = function() {
      reject(config.apiTimeoutMsg || 'abort promise');
    };
  });

  // 这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
  var abortablePromise = Promise.race([
    fetchPromise,
    abortPromise
  ]).catch(function(e) {
    const error = new Error(config.apiErrorMsg || e);
    throw error;
  });

  setTimeout(function() {
    abortFn();
  }, timeout);

  return abortablePromise;
}

export function commonGet(url, params, headers = {}, filterStatusFlag = true, filterJSONFlag = true, filterCodeFlag = true, credentials = 'include') {
  let _url = url;
  if (params) {
    _url += `?${queryString.stringify(params)}`
  }
  delete headers.host;
  delete headers.referer;
  var result = _fetch(fetch(_url, { method: 'GET', headers: headers, credentials: credentials }), config.apiTimeout);
  if (filterStatusFlag === true) {
    result = result.then(filterStatus);
    if (filterJSONFlag === true) {
      result = result.then(filterJSON);
    }
    if (filterCodeFlag === true) {
      result = result.then(filterCode);
    }
  }

  return result;
}
export function get(url, params) {
  return commonGet(url, params, {}, true, true, false);
}

export function furtherGet(url, params) {
  return get(url, params).then(filterCode);
}

export function putAndPost (url, method, params = {}, headers) {
  const defHeader = {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
  /*
  if (userInfo) {
    defHeader['token'] = userInfo.token;
  }*/
  if (headers) {
    Object.assign(defHeader, headers);
  }
  var _body = '';
  if (params) {
    var _bodyArr = [];
    for (var key in params) {
      if (key !== 'timeout') {
        _bodyArr.push(key + '=' + params[key]);
      }
    }
    _body = _bodyArr.join('&');
  }
  return _fetch(fetch(url, {
    method: method,
    headers: defHeader,
    credentials: 'include',
    body: _body
  }), params['timeout'] || config.apiTimeout).then(filterStatus).then(filterJSON);
}

export function post(url, params, headers) {
  return putAndPost(url, 'POST', params, headers);
}

export function imgUpload(url, params, headers) {
  var formObj = params.form;
  return _fetch(fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: new FormData(formObj)
  }), params['timeout'] || config.apiTimeout).then(filterStatus).then(filterJSON);
}
export function put(url, params, headers) {
  return putAndPost(url, 'PUT', params, headers);
}

export function furtherPost(url, params, headers) {
  return post(url, params, headers)
    .then(filterCode)
    .catch(error => {
      throw error;
    })
}