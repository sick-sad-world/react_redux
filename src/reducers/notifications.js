import { mergeArrayById } from '../helpers/reducerFactory';
import { PUSH_NOTIFICATION } from '../actions/types';

export default function reducer (state = [], action) {
  switch (action.type) {
    case PUSH_NOTIFICATION:
      return mergeArrayById(state, action.payload);
    default:
      return state;
  }
}