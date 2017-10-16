import types, { LOGOUT } from './types';
import defaultApp from './defaults';

export default (state = { ...defaultApp }, action) => {
  switch (action.type) {
    case LOGOUT:
      return {
        ...defaultApp,
        state: 2
      };
    case types.ERROR:
      return {
        ...state,
        state: 0,
        error: action.error
      };
    case types.STATE:
      return {
        ...state,
        state: action.state
      };
    default:
      return state;
  }
};
