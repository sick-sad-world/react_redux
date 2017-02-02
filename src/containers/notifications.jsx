// Import utility stuff
// ===========================================================================
import { reduce, bindAll } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import Notification from '../components/notification';

// Import Actions
// ===========================================================================
import { notification } from '../actions/actions';

class Notifications extends React.Component {
  // Create timeouts hash and bind handler
  // ===========================================================================
  constructor(props) {
    super(props);
    this.timeouts = {};
    bindAll(this, ['hideHandler']);
  }

  // Handler uset to set Notification visibility to [false]
  // ===========================================================================
  hideHandler (id) {
    if (this.timeouts[id]) {
      clearTimeout(this.timeouts[id]);
      delete this.timeouts[id];
    }
    this.props.dispatch(notification({id, visible: false}));
  }

  render() {
    let { limit, timeout, actions } = this.props;
    let ids = [];

    // Prepare message list
    // ===========================================================================
    let list = (
      <ul className='sys-notifications'>{ reduce(this.props.items, (acc, message, i) => {
        if (i <= limit && message.visible) {
          if (message.type !== 'loading' && !this.timeouts[message.id]) ids.push(message.id);
          acc.push(<Notification onClick={() => this.hideHandler(message.id)} key={message.id} {...message} actionText={actions[message.action]} />);
        }
        return acc;
      }, []) }</ul>
    );
    
    // Set timeout right before DOM rendering to minimize time delay
    // ===========================================================================
    ids.forEach((id) => this.timeouts[id] = setTimeout(this.hideHandler, timeout, id))
    return list;
  }
}

// Default number of notifications visible and timeout value
// ===========================================================================
Notifications.defaultProps = {
  timeout: 8000,
  limit: 4,
}

// Transform app state to component props
// @ deps -> App
// ===========================================================================
const mapStateToProps = ({ notifications }) => ({ items: notifications });

export default connect(mapStateToProps)(Notifications);