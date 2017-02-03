// Import utility stuff
// ===========================================================================


// Import React related stuff
// ===========================================================================
import React from 'React';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { errorHandler } from '../redux/app';
import { editUser } from '../redux/user';

// Import Child components
// ===========================================================================
// import EditUser from '../components/edit/user';

class Sourcesets extends React.Component {
  constructor(props) {
    super(props);
    this.updateItem = this.updateItem.bind(this);
  }

  updateItem (data) {
    this.props.updateUser(data).catch(this.props.errorHandler);
  }

  render () {
    return (
      <div className='mod-page'>
        
      </div>
    )
  }
}

// Connect our Container to State
// @ deps -> Sourcesets
// ===========================================================================
const mapStateToProps = ({user}) => ({...user});

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  editUser,
  errorHandler
}, dispatch))

export default connect(mapStateToProps, mapDispatchToProps)(Sourcesets);