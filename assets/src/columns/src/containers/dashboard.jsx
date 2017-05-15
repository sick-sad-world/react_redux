// Import utility stuff
// ===========================================================================
import { deleteColumn, editColumn, sortColumns } from '../actions';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { defaultInterface } from '../defaults';
import { makeDashboardSelector } from '../selectors';

function DashboardColumns({ children, ...props }) {
  return children(props);
}

DashboardColumns.propTypes = {
  column_ids: PropTypes.arrayOf(PropTypes.number),
  children: PropTypes.func.isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired
};

// Connect our Container to State
// @ deps -> Columns
// ===========================================================================
function mapStateToProps() {
  const selector = makeDashboardSelector();
  return (state, props) => selector(state, props);
}
export default connect(mapStateToProps(), { deleteColumn, editColumn, sortColumns })(DashboardColumns);
