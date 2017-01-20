import { LOGOUT, GET_LINKS, GET_LINK, LINKS_STATE, ADD_LINKS, REMOVE_LINK, ERROR } from '../actions/types';
import { splitText } from '../helpers/functions';


export const links = (state = {}, action) => {
  switch (action.type) {
    case LOGOUT: 
      return {};
    case ERROR:
      if (state[action.payload.entityId]) {
        return Object.assign({}, state, {
          [action.payload.entityId]: {
            state: 0,
            data: state[action.payload.entityId].data
          }
        })
      } else {
        return state;
      }
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
    case GET_LINK:
      return Object.assign({}, state, {
        [action.id]: {
          data: action.payload.map((link) => (link.hash === action.payload.hash) ? splitText(action.payload) : link),
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