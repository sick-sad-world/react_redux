import * as ACTIONS from '../actions/types';

export const messages = (state = [], action) => {
  if (action.type === ACTIONS['ERROR']) {
    action.type = (action.id) ? ACTIONS['EDIT_MESSAGE'] : ACTIONS['PUSH_MESSAGE'];
  }
  switch (action.type) {
    case ACTIONS['PUSH_MESSAGE']:
      return [action.payload, ...state];
    case ACTIONS['EDIT_MESSAGE']:
      return state.map((message) => (message.id === action.id) ? Object.assign({}, message, action.payload) : message);
    default:
      return state;
  }
}