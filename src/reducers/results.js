import { LOGOUT, GET_LINKS, LINKS_STATE, ADD_LINKS } from '../actions/types';
import { splitText } from '../helpers/functions';


export const links = (state = {}, action) => {
  switch (action.type) {
    case LOGOUT: 
      return {};
    case LINKS_STATE:
      return Object.assign({}, state, {
        [action.id]: Object.assign({data: []}, state[action.id], {state: action.state || 2})
      });
    case GET_LINKS:
      return Object.assign({}, state, {
        [action.id]: {
          data: action.payload.map(splitText),
          state: action.state || 2
        }
      });
    case ADD_LINKS:
      return Object.assign({}, state, {
        [action.id]: {
          data: [...state[action.id].data, ...action.payload.map(splitText)],
          state: action.state || 2
        }
      });
    default:
      return state;
  }
}