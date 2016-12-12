import { LOGIN, LOGOUT, GET_USER, CREATE_USER, EDIT_USER } from '../actions/types';
import { defaultUser } from './defaults';

export const user = (state = defaultUser, action) => {
  switch (action.type) {
    case LOGOUT:
    case LOGIN:
      return defaultUser;
    case GET_USER:
      return state = Object.assign(state, action.payload);
    case EDIT_USER:
      return state = Object.assign(state, action.payload);
    default:
      return state;
  }
}