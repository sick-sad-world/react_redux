import types from './types';
import { splitText } from './helpers';


export function splitResultText({ dispatch, getState }) {
  return next => (action) => {
    if (action.type === types.READ || action.type === types.PUSH) {
      action.payload.forEach(splitText);
    } else if (action.type === types.UPDATE) {
      splitText(action.payload);
    }
    return next(action);
  };
}
