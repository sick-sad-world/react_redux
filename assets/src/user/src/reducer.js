import { LOGOUT } from 'common/type-factory';
import types from './types';
import { defaultData } from './defaults';
// import UserImg from 'img/ph_user.png';

export default (state = { ...defaultData }, action) => {
  switch (action.type) {
    case types.CREATE:
    case types.READ:
    case types.UPDATE:
      return {
        ...state.payload,
        ...action.payload,
        image: '/img/ph_user.png'
      };
    case LOGOUT:
      return { ...defaultData };
    default:
      return state;
  }
};
