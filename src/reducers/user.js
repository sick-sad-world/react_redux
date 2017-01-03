import { LOGIN, LOGOUT, GET_USER, CREATE_USER, EDIT_USER } from '../actions/types';
import { defaultUser } from './defaults';

// Ensure path is absolute
// ===========================================================================
let absolutizePath = (path) => (path && path.indexOf('/') > 0) ? '/'+path : path;

export const user = (state = defaultUser, action) => {
  switch (action.type) {
    case LOGOUT:
    case LOGIN:
      return defaultUser;
    case GET_USER:
      // Delete error on initial getUser call where we:
      // check user authentification
      // Because it runs in silent mode 
      // ===========================================================================
      delete action.payload.error; 
      action.payload.image = absolutizePath(action.payload.image);
      return state = Object.assign({}, state, action.payload);
    case EDIT_USER:
      action.payload.image = absolutizePath(action.payload.image);
      return state = Object.assign({}, state, action.payload);
    default:
      return state;
  }
}