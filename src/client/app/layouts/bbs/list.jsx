import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import css from './list.styl'
import * as bbsActions from '../../actions/bbslist'
import * as UtilsActions from '../../actions/utils'


const BBSIndex = React.createClass({
  getInitialState: function() {
    return { 
      page: 1 
    };
  },
  componentWillMount() {
    console.log(222)
    if (this.props.bbslist.index.data === null) {
      this.props.actions.index({'pageNo': 1, 'pageSize': 10});
    }
  },
  propTypes: {
    bbslist: React.PropTypes.object
  },
  componentDidMount() {
    
  },
  render() {
    console.log(this.props)
    var self = this;
    return (
      <div>bbslist</div>
    )
  }
})

export default connect(state => ({
  bbslist: state.bbslist,
  utils: state.utils
}), dispatch => ({
  utilsAction: bindActionCreators(UtilsActions, dispatch),
  actions: bindActionCreators(bbsActions, dispatch)
}))(BBSIndex)
