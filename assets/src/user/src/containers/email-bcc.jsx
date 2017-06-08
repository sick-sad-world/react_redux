// Import helpers
// ===========================================================================
import { bindAll } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { stateNum } from 'common/typecheck';
import { makeEmailsSelector } from '../selectors';

// Import child components
// ===========================================================================
import EmailList from '../components/email-list';

// Import actions
// ===========================================================================
import { editUser } from '../actions';

// Email injectable Component - provide list of user Emails whatever it need
// ===========================================================================
class Emails extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, 'updateEmailList');
  }

  updateEmailList(emails, newEmail) {
    return this.props.editUser({ email_bcc: emails }).then(() => {
      if (this.props.onChange) return this.props.onChange(emails, newEmail);
      return null;
    }).catch(this.props.onError);
  }

  render() {
    return (
      <EmailList
        email={this.props.email}
        active={this.props.active}
        onClick={this.props.onClick}
        disabled={this.props.disabled || this.props.state > 2}
        data={this.props.data}
        onError={this.props.onError}
        onChange={this.updateEmailList}
      />
    );
  }
}

// Prop types check
// ===========================================================================
Emails.propTypes = {
  email: PropTypes.string.isRequired,
  active: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool.isRequired,
  state: stateNum.isRequired,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  onError: PropTypes.func,
  onChange: PropTypes.func,
  editUser: PropTypes.func.isRequired
};

// Connect our Container to State
// @ deps -> User
// ===========================================================================
export default connect(makeEmailsSelector, { editUser })(Emails);
