// Import required actions
// ===========================================================================
import { createData, deleteData, throwError } from '../actions/actions';

// Default actions for create and delete list item 
// @used to combain in List container
// ===========================================================================
const createListActions = (actions) => (dispatch) => {
  return Object.assign({
    dispatch: dispatch,
    actionCreate (type, name, order) {
      // Create new alert action starter
      // ===========================================================================
      return dispatch(createData(type)({ name, order })).catch((error) => dispatch(throwError(error)));
    },
    actionDelete (type, id) {
      // Delete existing alert action starter
      // ===========================================================================
      return dispatch(deleteData(type)({ id })).catch((error) => dispatch(throwError(error)));
    }
  }, actions);
};

export default createListActions;