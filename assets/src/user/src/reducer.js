import { LOGOUT } from 'common/type-factory';
import types from './types';
import { defaultData } from './defaults';

export default (state = { ...defaultData }, action) => {
  switch (action.type) {
    case types.CREATE:
    case types.READ:
    case types.UPDATE:
      return {
        ...state.payload,
        ...action.payload,
        image: defaultData.image
      };
    case LOGOUT:
      return { ...defaultData };
    default:
      return state;
  }
};
