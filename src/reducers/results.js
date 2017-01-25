import { LOGIN, LOGOUT, GET_LINKS, GET_LINK, LINKS_STATE, ADD_LINKS, FAVORITE_LINK, IGNORE_LINK } from '../actions/types';
import { splitText } from '../helpers/functions';


export const links = (state = {}, action) => {
  switch (action.type) {
    case LOGOUT:
    case LOGIN: 
      return {};
    case LINKS_STATE:
      return Object.assign({}, state, {
        [action.id]: {
          data: (state[action.id]) ? state[action.id].data : [],
          state: (action.hasOwnProperty('state')) ? action.state : 2
        }
      });
    case GET_LINKS:
      return Object.assign({}, state, {
        [action.id]: {
          data: action.payload.map(splitText),
          state: (action.hasOwnProperty('state')) ? action.state : 2
        }
      });
    case GET_LINK:
      return Object.assign({}, state, {
        [action.id]: {
          data: state[action.id].data.map((link) => (link.hash === action.payload.hash) ? Object.assign(link, splitText(action.payload)) : link),
          state: (action.hasOwnProperty('state')) ? action.state : 2
        }
      });
    case ADD_LINKS:
      return Object.assign({}, state, {
        [action.id]: {
          data: [...state[action.id].data, ...action.payload.map(splitText)],
          state: (action.hasOwnProperty('state')) ? action.state : 2
        }
      });
    case FAVORITE_LINK:
      return Object.assign({}, state, {
        [action.id]: {
          data: state[action.id].data.map((link) => (link.hash === action.payload.hash) ? Object.assign({}, link, {favorite: (action.payload.unfavorite) ? 0 : 1}) : link),
          state: (action.hasOwnProperty('state')) ? action.state : 2
        }
      });
    case IGNORE_LINK:
      return Object.assign({}, state, {
        [action.id]: {
          data: state[action.id].data.map((link) => (link.hash === action.payload.hash) ? Object.assign({}, link, {ignore: (action.payload.unignore) ? 0 : 1}) : link),
          state: (action.hasOwnProperty('state')) ? action.state : 2
        }
      });
    default:
      return state;
  }
}