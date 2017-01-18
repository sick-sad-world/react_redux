// Import utility stuff
// ===========================================================================
import { mapValues, isFunction } from 'lodash';
import { inject } from '../helpers/functions';
import editable from './behaviours/editable';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { bindActionCreators } from 'redux';

// Import actions
// ===========================================================================
import { createAction, throwError } from '../actions/actions';

export default class PageEdit extends React.Component {
  constructor(props, stateMap) {
    super(props);
    this.stateMap = stateMap;

    // Create state object
    // @including dropdowns
    // ===========================================================================
    this.state = Object.assign({
      loading: false
    }, this.mapItemToState(this.props.item));

    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      create: createAction(props.type, 4),
      update: createAction(props.type, 5),
      delete: createAction(props.type, 6),
      throwError: throwError
    }, this.props.dispatch);

    inject(this, editable);
  }

  // Pick an dropdown values to inject it into state
  // ===========================================================================
  mapItemToState (item) {
    return (item) ? mapValues(this.stateMap, (v, k) => (isFunction(v)) ? v.call(this, item) : item[k]) : {};
  }

  // Update state to hook our dropdowns
  // ===========================================================================
  componentWillReceiveProps(newProps) {
    if (newProps.state <= 2) {
      this.setState(this.mapItemToState(newProps.item));
      if (isFunction(this.onComponentWillReceiveProps)) {
        this.onComponentWillReceiveProps.call(this, newProps);
      }
    }
  }
}