// Import utility stuff
// ===========================================================================
import { reduce } from 'lodash';
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
import { hideMessage } from '../actions/actions';

class Messages extends React.Component {
  makeHideHandler (id) {
    return (e) => {
      this.hideMessage(id)
    }
  }

  render() {
    let { limit, timeout } = this.props;
    return (
      <ul>{ reduce(this.props.items, (acc, message, i) => {
        if (i <= limit && message.visible) {
          acc.push(<Message onClick={this.makeHideHandler(message.id)} key={message.id} {...message} />);
        }
        return acc;
      }, []) }</ul>
    );
  }
}

Messages.defaultProps = {
  timeout: 8000,
  limit: 4
}

// Transform app state to component props
// @ deps -> App
// ===========================================================================
const mapStateToProps = ({ app }) => ({ items: app.messages });

export default connect(mapStateToProps)(Messages);