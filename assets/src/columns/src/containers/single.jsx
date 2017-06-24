// Import utility stuff
// ===========================================================================
import { mapValues, pick } from 'lodash';
import * as availableActions from '../actions';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { defaultInterface } from '../defaults';
import { makeSingleSelector } from '../selectors';

function SingleColumnContainer({ children, schema, payload, state, actions, ...props }) {
  return (payload) ? children({
    state,
    payload: (schema) ? mapValues(schema, v => payload[v]) : payload,
    ...((actions && actions.length) ? pick(props, actions) : {})
  }) : null;
}

SingleColumnContainer.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string),
  schema: PropTypes.objectOf(PropTypes.string),
  col_id: PropTypes.number.isRequired,
  children: PropTypes.func.isRequired,
  payload: PropTypes.shape(defaultInterface)
};

// Connect our Container to State
// @ deps -> Columns
// ===========================================================================
export default connect(makeSingleSelector, availableActions)(SingleColumnContainer);
