import types from './types';
import { splitText, numerizeData } from './helpers';


export function splitResultText({ dispatch, getState }) {
  return next => (action) => {
    if (action.type === types.READ || action.type === types.PUSH) {
      return next({
        ...action,
        payload: action.payload.map(splitText)
      });
    } else if (action.type === types.UPDATE) {
      return next({
        ...action,
        payload: splitText(action.payload)
      });
    }
    return next(action);
  };
}

export function numerizeTabularData({ dispatch, getState }) {
  return next => (action) => {
    if (action.type === types.READ || action.type === types.PUSH) {
      return next({
        ...action,
        payload: action.payload.map(numerizeData)
      });
    } else if (action.type === types.UPDATE) {
      return next({
        ...action,
        payload: numerizeData(action.payload)
      });
    }
    return next(action);
  };
}
