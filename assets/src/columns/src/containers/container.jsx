// Import utility stuff
// ===========================================================================
import { mapValues, pick, get } from 'lodash';
import * as availableActions from '../actions';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { defaultInterface } from '../defaults';
import { makeContainerSelector } from '../selectors';

function ColumnsContainer({ children, schema, payload, state, actions, ...props }) {
  return children({
    state,
    payload: (schema) ? payload.map(column => mapValues(schema, v => get(column, v, null))) : payload,
    ...((actions && actions.length) ? pick(props, actions) : {})
  });
}

ColumnsContainer.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string),
  open: PropTypes.number,
  schema: PropTypes.objectOf(PropTypes.string),
  column_ids: PropTypes.arrayOf(PropTypes.number),
  children: PropTypes.func.isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired
};

// Connect our Container to State
// @ deps -> Columns
// ===========================================================================
export default connect(makeContainerSelector, availableActions)(ColumnsContainer);
