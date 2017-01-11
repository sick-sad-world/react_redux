import { LOGOUT, GET_USER, CREATE_USER, EDIT_USER } from '../actions/types';
import { defaultUser } from '../helpers/defaults';
import { absolutizePath } from '../helpers/functions';

export const user = (state = defaultUser, action) => {
  switch (action.type) {
    case LOGOUT:
      return defaultUser;
    case GET_USER:
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