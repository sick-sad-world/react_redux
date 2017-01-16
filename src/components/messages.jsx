// Import utility stuff
// ===========================================================================
import { reduce, bindAll } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import Message from './message';

// Import Actions
// ===========================================================================
import { sendMessage } from '../actions/actions';

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.timeouts = {};
    bindAll(this, ['hideHandler']);
  }

  hideHandler (id) {
    this.props.dispatch(sendMessage({visible: false}, id));
    if (this.timeouts[id]) {
      delete this.timeouts[id];
    }
  }

  render() {
    let { limit, timeout, actions } = this.props;
    let ids = [];
    let list = (
      <ul className='sys-messages'>{ reduce(this.props.items, (acc, message, i) => {
        if (i <= limit && message.visible) {
          if (message.type !== 'loading') {
            ids.push(message.id);
          }
          acc.push(<Message onClick={() => this.hideHandler(message.id)} key={message.id} {...message} actionText={actions[message.action]} />);
        }
        return acc;
      }, []) }</ul>
    );
    ids.forEach((id) => this.timeouts[id] = setTimeout(this.hideHandler, timeout, id))
    return list;
  }
}

Messages.defaultProps = {
  timeout: 8000,
  limit: 4,
  actions: {
    3: 'reading',
    4: 'creating',
    5: 'updating',
    6: 'sorting'
  }
}

// Transform app state to component props
// @ deps -> App
// ===========================================================================
const mapStateToProps = ({ messages }) => ({ items: messages });

export default connect(mapStateToProps)(Messages);