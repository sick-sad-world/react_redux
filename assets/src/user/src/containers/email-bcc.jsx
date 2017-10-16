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
import { editUser } from '../actions';

// Email injectable Component - provide list of user Emails whatever it need
// ===========================================================================
class Emails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: props.loading,
      error: null
    };
    bindAll(this, 'updateEmailList');
  }

  componentWillReceiveProps({loading}) {
    this.setState({ error: null, loading });
  }

  toggleLoading() {
    this.setState({ loading: !this.state.loading });
  }

  updateEmailList(emails, newEmail) {
    this.setState({ loading: true })
    return this.props.editUser({ email_bcc: emails }).then(() => {
      if (this.props.onChange) return this.props.onChange(emails, newEmail);
      return null;
    }).catch(({error}) => this.setState({ error, loading: false })).then(() => this.setState({ loading: false }));
  }

  render() {
    return (
      <EmailList
        email={this.props.email}
        active={this.props.active}
        onClick={this.props.onClick}
        error={this.state.error}
        loading={this.state.loading}
        description={(this.props.email === this.props.active) ? this.props.description : null}
        data={this.props.data}
        onChange={this.updateEmailList}
      />
    );
  }
}

Emails.defaultProps = {
  loading: false
};

// Prop types check
// ===========================================================================
Emails.propTypes = {
  email: PropTypes.string.isRequired,
  active: PropTypes.string,
  onClick: PropTypes.func,
  loading: PropTypes.bool.isRequired,
  description: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
  editUser: PropTypes.func.isRequired
};

// Connect our Container to State
// @ deps -> User
// ===========================================================================
export default connect(makeEmailsSelector, { editUser })(Emails);
