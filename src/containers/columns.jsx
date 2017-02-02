// Import utility stuff
// ===========================================================================
import { bindAll, find } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { errorHandler } from '../actions/actions';
import { createColumn, editColumn, deleteColumn } from '../actions/actions';

class ColumnsContainer extends React.Component {
  render () {
    return (
      <div className='mod-page'>
      </div>
    )
  }
}

// Connect our Container to State
// @ deps -> Columns
// ===========================================================================
const mapStateToProps = ({columns}, ownProps) => {
  return {
    ...columns,
    chosen: find(columns.payload, {id: parseInt(ownProps.params.id)})
  }
}

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  createColumn,
  editColumn,
  deleteColumn,
  errorHandler
}, dispatch))

export default connect(mapStateToProps, mapDispatchToProps)(ColumnsContainer);