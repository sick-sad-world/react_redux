import { reject, uniqBy, has, sortBy } from 'lodash';
import { LOGIN, LOGOUT } from './type-factory';

// Traverse Array and update data of item ID given
// If not @dir ? prepend : postpend data to array
// ===========================================================================
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

// Set new Orders to items in Collection
// ===========================================================================
export const updateCollectionOrder = (item, i, payload) => {
  const index = payload.indexOf(item.id);
  return {
    ...item,
    order: (index === -1) ? item.order : index
  };
};

// Middleware designed to provide ensurance about ordering
// ===========================================================================
export const sortMiddleware = () => next => (action) => {
  if (action.payload instanceof Array && action.payload.length && action.type.indexOf('READ') > -1) {
    // Resort items if action is READ and payload is Array
    // ===========================================================================
    return next({
      ...action,
      payload: sortBy(action.payload, 'order')
    });
  } else if (action.type.indexOf('SORT') > -1) {
    // Provide Array of ID's required by reducer default SORT handler
    // ===========================================================================
    return next({
      ...action,
      payload: action.payload.list.map(({ id }) => id)
    });
  }
  return next(action);
};

export default function createReducer(config) {
  return function reducer(state = [], action) {
    switch (action.type) {
      case LOGOUT:
      case LOGIN:
        return [];
      case config.READ:
        return uniqBy(action.payload, 'id');
      case config.SORT:
        return sortBy(state.map((item) => {
          const index = action.payload.indexOf(item.id);
          return {
            ...item,
            order: (index === -1) ? item.order : index
          };
        }), 'order');
      case config.CREATE:
      case config.UPDATE:
        return mergeArrayById(state, action.payload, true);
      case config.DELETE:
        return reject(state, { id: action.payload.id });
      default:
        if (has(config, action.type) && typeof config[action.type] === 'function') {
          return config[action.type](state, action.payload);
        }
        return state;

    }
  };
}

