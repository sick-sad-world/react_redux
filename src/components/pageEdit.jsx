// Import utility stuff
// ===========================================================================
import { isArray, bindAll, mapValues } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { bindActionCreators } from 'redux';

// Import actions
// ===========================================================================
import { createData, updateData, throwError } from '../actions/actions';

export default class PageEdit extends React.Component {
  constructor(props, dropdowns) {
    super(props);
    this.dropdowns = dropdowns;

    // Create state object
    // @including dropdowns
    // ===========================================================================
    this.state = Object.assign({
      loading: false
    }, this.processDropdowns(this.props.item));

    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      createData: createData(props.type),
      updateData: updateData(props.type),
      throwError: throwError
    }, this.props.dispatch);  
  }

  // Pick an dropdown values to inject it into state
  // ===========================================================================
  processDropdowns (item) {
    return (item) ? mapValues(this.dropdowns, (v, k) => {
      return v.call(this, item);
    }) : {};
  }

  // Update state to hook our dropdowns
  // ===========================================================================
  componentWillReceiveProps(nextProps) {
    this.setState(this.processDropdowns(nextProps.item));
  }

  // Send request to server with new props 
  // ===========================================================================
  preformAction (data) {
    if (this.props.item.id) {
      // Modify if item is already existed
      // ===========================================================================
      this.actions.updateData(Object.assign({id: this.props.item.id}, data)).catch(this.actions.throwError);
    } else {
      // Create item if ID == 0
      // ===========================================================================
      this.actions.createData(Object.assign({}, this.props.item, data)).then(({payload}) => {
        this.props.router.push(`/${this.props.type}s/${payload.id}`);
      }).catch(this.actions.throwError);
    }
  }

  // Input handler 
  // -> Function which handles action change
  // ===========================================================================
  inputHandler(e) {
    this.preformAction({
      [e.target.name]: e.target.value
    });
  }

  // Select handler creator
  // -> Function which handles both action and state change
  // ===========================================================================
  createSelectHandler (name) {
    return (value) => {
      // Set state to update selects
      // then run change handler to send chnages to server
      // ===========================================================================
      this.setState({[name]: value}, () => {
        this.preformAction({
          [name]: (isArray(value)) ? value.map(v => v.value) : value.value
        });
      });
    }
  }
}