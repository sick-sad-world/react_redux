// Import utility stuff
// ===========================================================================
import { reduce, bindAll } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import Message from './message';

// Import Actions
// ===========================================================================
import { sendMessage } from '../actions/actions';

class Messages extends React.Component {
  // Create timeouts hash and bind handler
  // ===========================================================================
  constructor(props) {
    super(props);
    this.timeouts = {};
    bindAll(this, ['hideHandler']);
  }

  // Handler uset to set MESSAGE visibility to [false]
  // ===========================================================================
  hideHandler (id) {
    if (this.timeouts[id]) {
      clearTimeout(this.timeouts[id]);
      delete this.timeouts[id];
    }
    this.props.dispatch(sendMessage({id, visible: false}));
  }

  render() {
    let { limit, timeout, actions } = this.props;
    let ids = [];

    // Prepare message list
    // ===========================================================================
    let list = (
      <ul className='sys-messages'>{ reduce(this.props.items, (acc, message, i) => {
        if (i <= limit && message.visible) {
          if (message.type !== 'error' && message.type !== 'loading' && !this.timeouts[message.id]) {
            ids.push(message.id);
          }
          acc.push(<Message onClick={() => this.hideHandler(message.id)} key={message.id} {...message} actionText={actions[message.action]} />);
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

// Default number of messages visible and timeout value
// ===========================================================================
Messages.defaultProps = {
  timeout: 8000,
  limit: 4,
  actions: {
    3: 'reading',
    4: 'creating',
    5: 'updating',
    6: 'deleting',
    7: 'sorting'
  }
}

// Transform app state to component props
// @ deps -> App
// ===========================================================================
const mapStateToProps = ({ messages }) => ({ items: messages });

export default connect(mapStateToProps)(Messages);