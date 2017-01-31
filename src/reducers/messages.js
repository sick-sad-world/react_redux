import { ERROR, PUSH_MESSAGE } from '../actions/types';
import { mergeArrayById } from '../helpers/functions';

export const messages = (state = [], action) => {
  switch (action.type) {
    case PUSH_MESSAGE:
    case ERROR:
      return mergeArrayById(state, action.payload);
    default:
      return state;
  }
}