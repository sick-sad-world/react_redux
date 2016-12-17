import { isArray } from 'lodash';

// Import required actions
// ===========================================================================
import { updateData, createData, throwError } from '../actions/actions';

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
      if (this.props.item.id) {
        // Modify if item is already existed
        // ===========================================================================
        dispatch(updateData(this.props.type)({
          id: this.props.item.id,
          [e.target.name]: value
        })).catch((err) => dispatch(throwError(err)))
      } else {
        // Create item if ID == 0
        // ===========================================================================
        dispatch(createData(this.props.type)(Object.assign({}, this.props.item, {[e.target.name]: value}))).then(({payload}) => {
          this.props.router.push(`/${this.props.type}s/${payload.id}`);
        }).catch((err) => dispatch(throwError(err)));
      }
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
            value: (isArray(value)) ? value.map(v => v.value) : value.value
          } 
        }));
      }
    }
  }, actions);
};

export default createEditActions;