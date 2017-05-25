// Import utility stuff
// ===========================================================================

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { limit, duration, defaultInterface } from './defaults';

// Import Child components
// ===========================================================================
import Notification from './components/notification';

// Import Actions
// ===========================================================================
import { notification } from './actions';
import { makeContainerSelector } from './selectors';

class Notifications extends React.Component {
  // Create timeouts hash and bind handler
  // ===========================================================================
  constructor(props) {
    super(props);
    this.timeouts = {};
    this.hideHandler = this.hideHandler.bind(this);
  }

  // Handler uset to set Notification visibility to [false]
  // ===========================================================================
  hideHandler(id) {
    if (this.timeouts[id]) {
      clearTimeout(this.timeouts[id]);
      delete this.timeouts[id];
    }
    this.props.hideNotification(id);
  }

  render() {
    const { listLimit, timeout, notifications } = this.props;
    const ids = [];

    // Prepare message list
    // ===========================================================================
    const list = (
      <ul className='sys-notifications'>
        {notifications.filter(message => message.visible).filter((message, i) => i <= listLimit).map((message) => {
          if (message.type !== 'loading' && !this.timeouts[message.id]) ids.push(message.id);
          return <Notification onClick={() => this.hideHandler(message.id)} key={message.id} {...message} />;
        })}
      </ul>
    );

    // Set timeout right before DOM rendering to minimize time delay
    // ===========================================================================
    ids.forEach((id) => {
      this.timeouts[id] = setTimeout(this.hideHandler, timeout, id);
    });
    return list;
  }
}

// Default number of notifications visible and timeout value
// ===========================================================================
Notifications.defaultProps = {
  timeout: duration,
  listLimit: limit
};

Notifications.propTypes = {
  timeout: PropTypes.number.isRequired,
  listLimit: PropTypes.number.isRequired,
  notifications: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired,
  hideNotification: PropTypes.func.isRequired
};

// Transform app state to component props
// @ deps -> App
// ===========================================================================
export default connect(makeContainerSelector, dispatch => ({
  hideNotification(id) {
    return dispatch(notification({ id, visible: false }));
  }
}))(Notifications);
