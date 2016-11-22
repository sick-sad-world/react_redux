import { SERVER_ERROR, LOGIN, LOGOUT, GET_USER, SET_APP_STATE } from '../actions/types';

export function app (state = {}, action) {
  switch (action.type) {
    case LOGIN:
    case GET_USER:
      return Object.assign({}, state, {userState: action.type === LOGIN || action.payload.id > 0});
    case LOGOUT:
      return Object.assign({}, state, {userState: false});
    case SET_APP_STATE:
      return Object.assign({}, state, {appState: action.appState});
    default:
      return state;
  }
}