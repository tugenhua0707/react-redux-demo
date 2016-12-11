import React from 'react'
// import ReactTransitionGroup from 'react/lib/ReactTransitionGroup'
// import ReactTransitionGroup from 'react/lib/ReactTransitionGroup'
// import ReactTransitionGroup from 'react-addons-css-transition-group';
import { TransitionMotion, spring } from 'react-motion';

const styles = {
  container: {
    width: '300px',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 2,
    position: 'absolute',
    top: '30px',
    padding: 10,
    left: '50%',
    marginLeft: '-150px',
    zIndex: 9999,
    minHeight: '32px',
    lineHeight: '32px'
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  }
}

const Toast = React.createClass({
  getInitialState: function() {
    return { items: [] };
  },
  componentDidMount: function() {
    
  },
  componentWillUnmount: function() {
    
  },
  handleRemove: function(i) {
    var newItems = this.state.items.slice();
    newItems.splice(i, 1);
    this.setState({ items: newItems });
  },
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.utils.toast.id);
    // console.log(this.props.utils.toast.id);
    if (this.props.utils.toast.id !== nextProps.utils.toast.id) {
      var newItems = this.state.items.concat([nextProps.utils.toast]);
      var self = this;
      setTimeout(function() {
        self.handleRemove(0);
      }, nextProps.utils.toast.timeout || 2000)
      this.setState({ items: newItems });
    }
  },
  willLeave() {
    return { opacity: spring(0) };
  },
  render: function() {
    var ss = this.state.items.map(item => ({
      key: 'toast_' + item.id,
      data: item.text,
      style: { opacity: 1 }
    }));
    // console.log(ss);
    return (
      <TransitionMotion
        willLeave={this.willLeave}
        styles={ss}>
        {interpolatedStyles =>
          <div>
            {
              interpolatedStyles.map(config => {
                return (
                          <div className='toast-cls' key={config.key} style={{ ...styles.container, ...config.style }}>
                            <div style={styles.text}>{config.data}</div>
                          </div>
                        )
              })
            }

          </div>
        }
      </TransitionMotion>
    )
  }
})

export default Toast
