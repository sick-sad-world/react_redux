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
import { makeSingleSelector } from '../selectors';

function SingleColumnContainer({ output, children, schema, payload, actions, ...props }) {
  const chosenActions = (actions && actions.length) ? pick(props, actions) : {};
  const mappedPayload = (schema) ? mapValues(schema, v => get(payload, v, null)) : payload;
  return (payload) ? children({
    ...chosenActions,
    [output]: mappedPayload
  }) : null;
}

SingleColumnContainer.defaultProps = {
  output: 'payload'
};

SingleColumnContainer.propTypes = {
  output: PropTypes.string.isRequired,
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
