// Import utility stuff
// ===========================================================================
import { isArray, includes, without, concat, mapValues, isFunction } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { bindActionCreators } from 'redux';

// Import actions
// ===========================================================================
import { createData, updateData, deleteData, throwError } from '../actions/actions';

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
      createData: createData(props.type),
      updateData: updateData(props.type),
      deleteData: deleteData(props.type),
      throwError: throwError
    }, this.props.dispatch);  
  }

  // Pick an dropdown values to inject it into state
  // ===========================================================================
  mapItemToState (item) {
    return (item) ? mapValues(this.stateMap, (v, k) => (isFunction(v)) ? v.call(this, item) : item[k]) : {};
  }

  // Update state to hook our dropdowns
  // ===========================================================================
  componentWillReceiveProps(newProps) {
    if (newProps.appState !== 3) {
      this.setState(this.mapItemToState(newProps.item));
      if (isFunction(this.onComponentWillReceiveProps)) {
        this.onComponentWillReceiveProps.call(this, newProps);
      }
    }
  }

  // Send request to server with new props 
  // ===========================================================================
  preformAction (name) {
    return () => {
      let value = this.state[name];
      let item = this.props.item;
      if (item.id) {
        // Modify if item is already existed
        // ===========================================================================
        if (item[name] !== value) {
          this.actions.updateData({id: item.id, [name]: value}).catch(this.actions.throwError);
        }
      } else {
        // Create item if ID == 0
        // ===========================================================================
        this.actions.createData(Object.assign({}, item, {[name]: value})).then(({payload}) => {
          this.props.router.push(`/${this.props.type}s/${payload.id}`);
        }).catch(this.actions.throwError);
      }
    }
  }

  // Input handler 
  // -> Function which handles action change
  // ===========================================================================
  stateHandler(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  // 
  // ===========================================================================
  changeHandler(e, val) {
    let name = e.target ? e.target.name : e;
    let value = e.target ? e.target.value : val;
    this.setState({
      [name]: value
    }, this.preformAction(name));
  }

  // Select handler creator
  // -> Function which handles both action and state change
  // ===========================================================================
  createSelectHandler (name) {
    return (v) => {
      // Set state to update selects
      // then run change handler to send chnages to server
      // ===========================================================================
      this.setState({
        [name]: (isArray(v)) ? v.map(v => v.value) : (v) ? v.value : v
      }, this.preformAction(name));
    }
  }

  modifyStateArray (e) {
    let name = e.target.name;
    let value = e.target.value;
    if (includes(this.state[name], value)) {
      value = without(this.state[name], value);
    } else {
      value = concat(this.state[name], value);
    }
    this.setState({[name]: value}, this.preformAction(name));
  }
}