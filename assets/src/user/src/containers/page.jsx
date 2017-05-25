import { bindAll } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { stateNum, textShape } from 'common/typecheck';

// Import data related stuff
// ===========================================================================
import { makeContainerSelector } from '../selectors';
import { defaultInterface } from '../defaults';

// Import actions
// ===========================================================================
import { editUser } from '../actions';

// Import Child components
// ===========================================================================
import EditUser from '../components/edit';

class User extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, 'updateItem', 'onEmailBccError');
  }

  updateItem(data) {
    this.props.editUser(data);
  }

  onEmailBccError(error) {
    if (this.props.notification instanceof Function) {
      this.props.notification({ type: 'error', text: error });
    } else {
      // some fallback
    }
  }

  render() {
    return (
      <div className='mod-page'>
        <EditUser data={this.props.payload} state={this.props.state} update={this.updateItem} texts={this.props.texts} formProps={{
          onEmailBccError: this.onEmailBccError
        }} />
      </div>
    );
  }
}

User.defaultProps = {
  texts: {
    title: 'Profile settings',
    description: 'Tell us a bit about yourself...',
    confirmation: '{data} was changed. Save changes?'
  }
};

// Prop type check
// ===========================================================================
User.propTypes = {
  texts: PropTypes.shape(textShape).isRequired,
  editUser: PropTypes.func.isRequired,
  notification: PropTypes.func,
  state: stateNum.isRequired,
  payload: PropTypes.shape(defaultInterface).isRequired
};

// Connect our Container to State
// @ deps -> User
// ===========================================================================
export default connect(makeContainerSelector, { editUser })(User);
