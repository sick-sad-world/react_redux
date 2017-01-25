import { ERROR, PUSH_MESSAGE, EDIT_MESSAGE } from '../actions/types';

export const messages = (state = [], action) => {
  switch (action.type) {
    case PUSH_MESSAGE:
    case ERROR:
      return [action.payload, ...state];
    case EDIT_MESSAGE:
      return state.map((message) => (message.id === action.id) ? Object.assign({}, message, action.payload) : message);
    default:
      return state;
  }
}