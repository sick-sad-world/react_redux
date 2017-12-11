// Import helpers
// ===========================================================================
import { bindAll } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeEmailsSelector } from '../selectors';

// Import child components
// ===========================================================================
import EmailList from '../components/email-list.jsx';

// Import actions
// ===========================================================================
import { actions } from '../redux';

// Email injectable Component - provide list of user Emails whatever it need
// ===========================================================================
class Emails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    bindAll(this, 'updateEmailList');
  }

  componentWillReceiveProps({ disabled }) {
    this.setState({ disabled });
  }

  updateEmailList(emails, newEmail) {
    this.setState({ loading: true });
    return this.props.editUser({ email_bcc: emails }).then(() => {
      if (this.props.onChange) return this.props.onChange(emails, newEmail);
      return null;
    }).catch(console.error).then(() => this.setState({ loading: false }));
  }

  render() {
    return (
      <EmailList
        email={this.props.email}
        active={this.props.active}
        onClick={this.props.onClick}
        disabled={this.props.disabled}
        loading={this.state.loading}
        description={(this.props.email === this.props.active) ? this.props.description : null}
        data={this.props.data}
        onChange={this.updateEmailList}
      />
    );
  }
}

Emails.defaultProps = {
  disabled: false
};

// Prop types check
// ===========================================================================
Emails.propTypes = {
  email: PropTypes.string.isRequired,
  active: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool.isRequired,
  description: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
  editUser: PropTypes.func.isRequired
};

// Connect our Container to State
// @ deps -> User
// ===========================================================================
export default connect(makeEmailsSelector, { editUser: actions.editUser })(Emails);
