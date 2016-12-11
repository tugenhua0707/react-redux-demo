import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { browserHistory } from 'react-router'

import * as UtilsActions from '../actions/utils';

const App = React.createClass({

  render() {
    var self = this;
    return (
      <div>{this.props.children}</div>
    )
  }
})
export default connect(state => ({
  utils: state.utils
}), dispatch => ({
  utilsActions: bindActionCreators(UtilsActions, dispatch)
}))(App)
