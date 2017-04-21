// Import helpers
// ===========================================================================

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { emailStr, stateNum } from 'common/typecheck';
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

  render() {
    return (
      <EmailList
        email={this.props.email}
        active={this.props.active}
        onClick={this.props.onClick}
        disabled={this.props.disabled || this.props.state > 2}
        data={this.props.data}
        onError={this.props.onError}
        onChange={emails => this.props.editUser({ email_bcc: emails })}
      />
    );
  }
}

// Prop types check
// ===========================================================================
Emails.propTypes = {
  email: emailStr.isRequired,
  active: emailStr,
  onClick: PropTypes.func,
  disabled: PropTypes.bool.isRequired,
  state: stateNum.isRequired,
  data: PropTypes.arrayOf(emailStr).isRequired,
  onError: PropTypes.func,
  editUser: PropTypes.func.isRequired
};

// Connect our Container to State
// @ deps -> User
// ===========================================================================
const mapStateToProps = () => {
  const selector = makeEmailsSelector();
  return (state, props) => selector(state, props);
};

const mapDispatchToProps = dispatch => ({
  editUser(...args) {
    return dispatch(editUser(...args));
  }
});

export default connect(mapStateToProps(), mapDispatchToProps)(Emails);
