import { reject, uniqBy, has } from 'lodash';
import { LOGIN, LOGOUT } from './type-factory';

export const mergeArrayById = (arr, obj) => {
  let changed = false;
  const result = arr.map((item) => {
    if (item.id !== obj.id) return { ...item };
    changed = true;
    return { ...item, ...obj };
  });
  if (!changed) result.push({ ...obj });
  return result;
};

export const updateObjectById = (state, id, updater) => ({
  ...state,
  [id]: updater(state[id])
});

export default function createReducer(config) {
  return function reducer(state = { state: 1, payload: [] }, action) {
    switch (action.type) {
      case LOGOUT:
      case LOGIN:
        return { state: 1, payload: [] };
      case config.STATE:
        return {
          state: (action.state >= 0) ? action.state : 0,
          payload: state.payload
        };
      case config.READ:
        return {
          state: 2,
          payload: uniqBy(action.payload, 'id')
        };
      case config.CREATE:
      case config.UPDATE:
        return {
          state: 2,
          payload: mergeArrayById(state.payload, action.payload)
        };
      case config.DELETE:
        return {
          state: 2,
          payload: reject(state.payload, { id: action.payload.id })
        };
      default:
        if (has(config, action.type) && typeof config[action.type] === 'function') {
          return {
            state: 2,
            payload: config[action.type](state.payload, action.payload)
          };
        }
        return state;

    }
  };
}
