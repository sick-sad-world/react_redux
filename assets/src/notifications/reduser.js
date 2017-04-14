
import { mergeArrayById } from 'common/reducer-factory';
import types from './types';

export default (state = [], action) => {
  switch (action.type) {
    case types.NOTIFICATION:
      return mergeArrayById(state, action.payload);
    default:
      return state;
  }
};
