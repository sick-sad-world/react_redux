// Import utility stuff
// ===========================================================================


// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { errorHandler } from '../redux/app';
import { editUser } from '../redux/user';
import { notification } from '../redux/notifications';

// Import Child components
// ===========================================================================
import EditUser from '../components/edit/user';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.updateItem = this.updateItem.bind(this);
  }

  updateItem (data) {
    this.props.editUser(data).catch(this.props.errorHandler);
  }

  render () {
    return (
      <div className='mod-page'>
        <EditUser data={this.props.payload} state={this.props.state} update={this.updateItem} notification={this.props.notification} />
      </div>
    )
  }
}

// Connect our Container to State
// @ deps -> User
// ===========================================================================
const mapStateToProps = ({user}) => ({...user});

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  editUser,
  notification,
  errorHandler
}, dispatch))

export default connect(mapStateToProps, mapDispatchToProps)(User);