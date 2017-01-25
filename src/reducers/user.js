import { LOGOUT, GET_USER, CREATE_USER, EDIT_USER } from '../actions/types';
import { defaultUser } from '../helpers/defaults';

export const user = (state = defaultUser, action) => {
  switch (action.type) {
    case LOGOUT:
      return defaultUser;
    case GET_USER:
      delete action.payload.error;
      return state = Object.assign({}, state, action.payload, {image: defaultUser.image});
    case EDIT_USER:
      return state = Object.assign({}, state, action.payload);
    default:
      return state;
  }
}