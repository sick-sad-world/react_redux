
// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { textShape } from 'common/typecheck';

// Import data related stuff
// ===========================================================================
import { makeContainerSelector } from '../selectors';
import { defaultInterface } from '../defaults';

// Import actions
// ===========================================================================
import { editUser } from '../actions';

// Import Child components
// ===========================================================================
import EditUser from '../components/edit.jsx';

class UserSettings extends React.Component {
  render() {
    return (
      <div className='mod-page'>
        <EditUser
          data={this.props.payload}
          onSubmit={this.props.editUser}
          texts={this.props.texts}
        />
      </div>
    );
  }
}

UserSettings.defaultProps = {
  texts: {
    title: 'Profile settings',
    description: 'Tell us a bit about yourself...',
    confirmation: '{data} were changed. Save changes?'
  }
};

// Prop type check
// ===========================================================================
UserSettings.propTypes = {
  texts: PropTypes.shape(textShape).isRequired,
  editUser: PropTypes.func.isRequired,
  notification: PropTypes.func,
  payload: PropTypes.shape(defaultInterface).isRequired
};

// Connect our Container to State
// @ deps -> User
// ===========================================================================
export default connect(makeContainerSelector, { editUser })(UserSettings);
