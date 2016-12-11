import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore';
import { browserHistory } from 'react-router';
import createRoutes from './routes/index'

const store = configureStore(__REDUX_STATE__);
render(
  <Provider store={store}>
     { createRoutes(browserHistory, store.getState()) }
  </Provider>,
  document.getElementById('app')
)