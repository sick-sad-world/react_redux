// Import helpers
// ===========================================================================

// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import child components
// ===========================================================================
import EmailList from '../components/list/emails';

// Import actions
// ===========================================================================
import { editUser } from '../redux/user';
import { errorHandler } from '../redux/app';
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
        onChange={(email_bcc) => this.editUser({email_bcc}).catch(this.props.errorHandler)}
      />
    );
  }
}


// Connect our Container to State
// @ deps -> User
// ===========================================================================
const mapStateToProps = ({user}) => ({
  state: user.state,
  email: user.payload.email,
  data: user.payload.email_bcc
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  editUser,
  notification,
  errorHandler
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Emails);
