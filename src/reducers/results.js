import { GET_LINKS } from '../actions/types';

export const links = (state = {}, action) => {
  switch (action.type) {
    case GET_LINKS:
      return state[action.id] = action.payload;
    default:
      return state;
  }
}