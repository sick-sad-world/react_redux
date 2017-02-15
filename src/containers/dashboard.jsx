// Import utility stuff
// ===========================================================================
import { bindAll } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { errorHandler } from '../redux/app';
import { editColumn, deleteColumn } from '../redux/columns';

// Import Child components
// ===========================================================================


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    console.log('Dashboard cnst');
  }

  updateItem (data) {
    this.props.updateUser(data).catch(this.props.errorHandler);
  }

  render () {
    console.log('Dashboard render');
    return (
      <div className='mod-dashboard'>
        {this.props.payload.map((c) => JSON.stringify(c)).join(' ')}
      </div>
    )
  }
}

// Connect our Container to State
// @ deps -> Columns
// ===========================================================================
const mapStateToProps = ({columns}) => ({...columns});

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  editColumn,
  deleteColumn,
  errorHandler
}, dispatch))

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);