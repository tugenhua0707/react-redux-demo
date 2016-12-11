var domainURL = 'http://xx.com';
module.exports = {
  // origin: domainURL,
  api: {
    bbsIndex: 'http://127.0.0.1:7012/static/index.json'
  },
  apiTimeout: 5000,
  apiTimeoutMsg: '网络超时，请稍后再试！',
  apiErrorMsg: '网络异常，请稍后再试！',
  apiUnAuthMsg: '用户登录超时,请重新登录'
};