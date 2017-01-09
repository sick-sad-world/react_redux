import { GET_LINKS, SET_LINKS_STATE } from '../actions/types';

export const links = (state = {}, action) => {
  switch (action.type) {
    case SET_LINKS_STATE: 
      return Object.assign({}, state, Object.assign({}, state[action.id], {state: action.state}));
    case GET_LINKS:
      return Object.assign({}, state, {
        [action.id]: {
          data: action.payload,
          state: action.state || state[action.id].state
        }
      });
    default:
      return state;
  }
}