import types from './types';
import { LOGIN, LOGOUT } from 'common/type-factory';
import { defaultGraphs } from './defaults';

export default (state = { ...defaultGraphs }, action) => {
  switch (action.type) {
    case LOGOUT:
    case LOGIN:
    case types.DELETE:
      return { ...defaultGraphs };
    case types.READ:
      return {
        ...state,
        payload: action.payload
      };
    case types.UPDATE_CACHE:
      return {
        ...state,
        cache: {
          ...state.cache,
          [action.entity.id]: {
            timestamp: action.entity.timestamp,
            data: action.payload
          }
        }
      };
    case types.STATE:
      return {
        ...state,
        state: (typeof action.state === 'number') ? action.state : 0
      };
    default:
      return state;
  }
};
