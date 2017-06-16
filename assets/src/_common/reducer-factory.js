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
  if (action.payload instanceof Array && action.payload.length && action.payload[0].order && action.type.indexOf('READ') > -1) {
    action.payload = sortBy(action.payload.map(item => ({ ...item, order: (item.order === null) ? -1 : item.order })), 'order');
  } else if (action.type.indexOf('SORT') > -1) {
    action.payload = action.payload.list.map(({ id }) => id);
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
          payload: sortBy(state.payload.map((item) => {
            const index = action.payload.indexOf(item.id);
            return {
              ...item,
              order: (index === -1) ? item.order : index
            };
          }), 'order')
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
