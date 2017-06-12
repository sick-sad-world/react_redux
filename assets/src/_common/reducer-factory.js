import { reject, uniqBy, has, sortBy } from 'lodash';
import { LOGIN, LOGOUT } from './type-factory';

export const mergeArrayById = (arr, obj, dir) => {
  let changed = false;
  const method = (dir) ? 'unshift' : 'push';
  const result = arr.map((item) => {
    if (item.id !== obj.id) return { ...item };
    changed = true;
    return { ...item, ...obj };
  });
  if (!changed) result[method]({ ...obj });
  return result;
};

export const updateObjectById = (state, id, updater) => ({
  ...state,
  [id]: updater(state[id])
});

export const sortMiddleware = store => next => (action) => {
  if (action.payload && action.payload.length && action.payload[0].order) {
    action.payload = sortBy(action.payload, 'order');
  }
  return next(action);
};

export default function createReducer(config) {
  return function reducer(state = { state: 1, payload: [] }, action) {
    switch (action.type) {
      case LOGOUT:
      case LOGIN:
        return { state: 1, payload: [] };
      case config.STATE:
        return {
          state: (typeof action.state === 'number') ? action.state : 0,
          payload: state.payload
        };
      case config.READ:
        return {
          state: 2,
          payload: uniqBy(action.payload, 'id')
        };
      case config.SORT:
        return {
          state: 2,
          payload: action.payload.list.map(item => ({
            ...state.payload.find(({ id }) => id === item.id),
            ...item
          }))
        };
      case config.CREATE:
      case config.UPDATE:
        return {
          state: 2,
          payload: mergeArrayById(state.payload, action.payload, true)
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
