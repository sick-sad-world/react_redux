import * as ACTIONS from '../actions/types';

export const messages = (state = [], action) => {
  switch (action.type) {
    case ACTIONS['PUSH_MESSAGE']:
    case ACTIONS['ERROR']:
      return [action.payload, ...state];
    case ACTIONS['EDIT_MESSAGE']:
      return state.map((message) => (message.id === action.id) ? Object.assign({}, message, action.payload) : message);
    default:
      return state;
  }
}