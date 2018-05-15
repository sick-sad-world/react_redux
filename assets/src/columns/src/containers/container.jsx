// Import utility stuff
// ===========================================================================
import mapValues from 'lodash/mapValues';
import pick from 'lodash/pick';
import get from 'lodash/get';
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

function mapPayloadToSchema(payload, schema) {
  return Array.isArray(payload) ? payload.map(column => mapValues(schema, v => get(column, v, null))) : mapValues(schema, v => get(payload, v, null));
}

function ColumnsContainer({ output, children, schema, payload, actions, ...props }) {
  const chosenActions = (actions && actions.length) ? pick(props, actions) : {};
  return children({
    ...chosenActions,
    [output]: (schema) ? mapPayloadToSchema(payload, schema) : payload
  });
}

ColumnsContainer.defaultProps = {
  output: 'payload'
};

ColumnsContainer.propTypes = {
  output: PropTypes.string.isRequired,
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
