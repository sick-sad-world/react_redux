import { LOGOUT } from 'common/type-factory';
import types from './types';
import defaultUser from './defaults';

export default (state = { ...defaultUser }, action) => {
  switch (action.type) {
    case types.STATE:
      return {
        ...state,
        state: action.state
      };
    case types.CREATE:
    case types.READ:
    case types.UPDATE:
      return {
        ...state,
        state: 2,
        payload: {
          ...state.payload,
          ...action.payload,
          image: '/img/ph_user.png'
        }
      };
    case LOGOUT:
      return {
        ...defaultUser
      };
    default:
      return state;
  }
};
