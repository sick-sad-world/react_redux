import { mapValues, isFunction, isUndefined } from 'lodash';
import { updateArrayWithValue } from '../../helpers/functions';

// Editable behaviours
// ===========================================================================
export default {

  // Update [Value] in state and [preformAction] after
  // ===========================================================================
  _runStatefullAction(name, value) {
    return this.setState({
      [name]: value
    }, this.preformAction(name));
  },

  // Pick an dropdown values to inject it into state
  // ===========================================================================
  mapItemToState (item) {
    return (item) ? mapValues(this.stateMap, (v, k) => (isFunction(v)) ? v.call(this, item) : item[k]) : {};
  },

  // Update state in oreder to input changes
  // @key -> name @value -> value
  // ===========================================================================
  updateState(e, val) {
    let name = e.target ? e.target.name : e;
    let value = parseFloat(e.target ? e.target.value : val);
    if (value !== value) {
      value = e.target ? e.target.value : val;
    }
    this.setState({
      [name]: value
    });
  },


  updateValue(e, val) {
    let name = e.target ? e.target.name : e;
    let value = parseFloat(e.target ? e.target.value : val);
    if (value !== value) {
      value = e.target ? e.target.value : val;
    }
    return this._runStatefullAction(name, (this.state[name] instanceof Array) ? updateArrayWithValue(this.state[name], value) : value);
  },

  // Make handler, provide name to wrapper
  // Update [Value] in state and [preformAction] after
  // ===========================================================================
  makeSelectHandler(name) {
    return (v) => this._runStatefullAction(name, (v instanceof Array) ? v.map(v => v.value) : (v) ? v.value : v)
  },

  // Send request to server with new props 
  // @name -> provided to wrapper, @value -> got from state
  // ===========================================================================
  preformAction(name) {
    return () => {
      let value = (!isUndefined(value)) ? value : this.state[name];
      let item = this.props.item;
      if (item.id) {
        // Modify if item is already existed
        // ===========================================================================
        if (item[name] !== value) {
          this.actions.update({
            id: item.id,
            [name]: value
          }).catch(this.actions.throwError);
        }
      } else {
        // Create item if ID == 0
        // ===========================================================================
        this.actions.create({ ...item,
          [name]: value
        }).then(({
          payload
        }) => {
          this.props.router.push(`/${this.props.type}s/${payload.id}`);
        }).catch(this.actions.throwError);
      }
    }
  }

}