import { LOGOUT, LOGIN } from '../helpers/types';
import { reject, uniqBy } from 'lodash';

export const mergeArrayById = (arr, obj) => {
  let changed = false;
  let result = arr.map((item) => {
    if (item.id !== obj.id) return {...item};
    changed = true;
    return {...item, ...obj};
  });
  if (!changed) result.push({...obj});
  return result;
}

export default function createReducer (config) {
  return function reducer (state = {state: 1, payload: []}, action) {
    switch (action.type) {
      case LOGOUT:
      case LOGIN:
        return {state: 1, payload: []};
      case config.STATE:
        return {
          state: action.state || 2,
          payload: state.payload
        }
      case config.GET:
        return {
          state: 2,
          payload: uniqBy(action.payload, 'id')
        }
      case config.ADD:
      case config.EDIT:
        return {
          state: 2,
          payload: mergeArrayById(state.payload, action.payload)
        }
      case config.REMOVE:
        return {
          state: 2,
          payload: reject(state.payload, {id: action.payload.id})
        }
      default:
        if (config.hasOwnProperty(action.type) && typeof config[action.type] === 'function') {
          return {
            state: 2,
            payload: config[action.type](state.payload, action.payload)
          };
        } else {
          return state;
        }
    }
  }
}