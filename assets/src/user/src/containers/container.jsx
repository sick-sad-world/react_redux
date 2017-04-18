// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { makeContainerSelector } from '../selectors';

// Import actions
// ===========================================================================
import { editUser } from '../actions';
import { notification } from 'src/notifications/actions';

// Import Child components
// ===========================================================================
import EditUser from '../components/edit';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.updateItem = this.updateItem.bind(this);
  }

  updateItem(data) {
    this.props.editUser(data);
  }

  render() {
    return (
      <div className='mod-page'>
        <EditUser data={this.props.payload} state={this.props.state} update={this.updateItem} notification={this.props.notification} />
      </div>
    );
  }
}

User.propTypes = {
  editUser: PropTypes.func.isRequired,
  notification: PropTypes.func.isRequired,
  state: PropTypes.number.isRequired,
  payload: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    email_bcc: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired
};

// Connect our Container to State
// @ deps -> User
// ===========================================================================
const mapStateToProps = () => {
  const selector = makeContainerSelector();
  return (state, props) => selector(state, props);
};

const mapDispatchToProps = dispatch => (bindActionCreators({ editUser, notification }, dispatch));

export default connect(mapStateToProps(), mapDispatchToProps)(User);
