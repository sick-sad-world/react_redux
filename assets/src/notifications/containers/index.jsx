// Import utility stuff
// ===========================================================================
import { bindAll } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import Notification from '../components/notification';

// Import Actions
// ===========================================================================
import notification from '../actions';

class Notifications extends React.Component {
  // Create timeouts hash and bind handler
  // ===========================================================================
  constructor(props) {
    super(props);
    this.timeouts = {};
    bindAll(this, 'hideHandler');
  }

  // Handler uset to set Notification visibility to [false]
  // ===========================================================================
  hideHandler(id) {
    if (this.timeouts[id]) {
      clearTimeout(this.timeouts[id]);
      delete this.timeouts[id];
    }
    this.props.dispatch(notification({ id, visible: false }));
  }

  render() {
    const { limit, timeout, notifications } = this.props;
    const ids = [];

    // Prepare message list
    // ===========================================================================
    const list = (
      <ul className='sys-notifications'>
        {notifications.filter(message => message.visible).filter((message, i) => i <= limit).map((message) => {
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
  timeout: 8000,
  limit: 4
};

Notifications.propTypes = {
  timeout: PropTypes.number,
  limit: PropTypes.number.isRequired,
  notifications: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

// Transform app state to component props
// @ deps -> App
// ===========================================================================
const mapStateToProps = ({ notifications }) => ({ notifications });

export default connect(mapStateToProps)(Notifications);
