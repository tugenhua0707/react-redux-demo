import React from 'react'
// import { Provider } from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'

import App from '../layouts/app'
import BBSList from '../layouts/bbs/list'

import { browserHistory } from 'react-router';

const requireAuth = (states, nextState, replace, callback) => {
  if (states && states.utils && states.utils.token === null) {
    if (typeof global.window === 'undefined') { // node Env
      callback(new Error("NOTLOGIN"));
    } else { // browser Env
      // browserHistory.push("/login");
    }
  }
  callback();
}
export default function(history, states) {
  return (
    <Router history={history}>
      <Route path='/' component={App} onEnter={requireAuth.bind(this, states)}>
        <Route path='/bbs/list' component={BBSList} ></Route>
      </Route>
    </Router>
  )
}