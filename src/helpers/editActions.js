import { isArray } from 'lodash';

// Import required actions
// ===========================================================================
import { updateData, throwError } from '../actions/actions';

// Default actions for create and delete list item 
// @used to combain in List container
// ===========================================================================
const createEditActions = (actions) => (dispatch) => {
  return Object.assign({
    dispatch: dispatch,
    // Send request to server with new props 
    // ===========================================================================
    changeHandler (e) {
      let value = e.target.value;
      dispatch(updateData(this.props.type)({
        id: this.props.item.id,
        [e.target.name]: (isArray(value)) ? value.map(v => v.id) : value
      })).catch((err) => dispatch(throwError(err)))
    },

    // Select handler creator
    // -> Function which handles both action and state change
    // ===========================================================================
    createSelectHandler (name, component) {
      return (value) => {
        // Set state to update selects
        // then run change handler to send chnages to server
        // ===========================================================================
        component.setState({[name]: value}, () => component.changeHandler({
          target: {
            name: name,
            value: (value.hasOwnProperty(length)) ? value : value.value
          } 
        }));
      }
    }
  }, actions);
};

export default createEditActions;