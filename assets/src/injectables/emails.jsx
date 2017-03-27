// Import helpers
// ===========================================================================

// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { makeEmailsSelector } from '../selectors/user';

// Import child components
// ===========================================================================
import EmailList from '../components/emails';

// Import actions
// ===========================================================================
import { editUser } from '../redux/user';
import { notification } from '../redux/notifications';

// Email injectable Component - provide list of user Emails whatever it need
// ===========================================================================
class Emails extends React.Component {
  render () {
    return (
      <EmailList
        email={this.props.email}
        active={this.props.active}
        action={this.props.action}
        disabled={this.props.disabled || this.state > 2}
        data={this.props.data}
        onError={(err) => this.props.notification({type: 'error', text: err})}
        onChange={(email_bcc) => this.props.editUser({email_bcc})}
      />
    );
  }
}


// Connect our Container to State
// @ deps -> User
// ===========================================================================
const mapStateToProps = () => {
  const selector = makeEmailsSelector();
  return (state, props) => selector(state, props);
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  editUser,
  notification
}, dispatch);

export default connect(mapStateToProps(), mapDispatchToProps)(Emails);
