import _ from 'lodash';

export default store => next => action => {
  if (action.payload) {
    if (Array.isArray(action.payload)) {
      action.payload = _.transform(action.payload, (res, item, i) => {
        res[item.id] = _.omit(item, 'id');
      }, {});
    } else if (action.payload.hasOwnProperty('id')) {
      action.id = action.payload.id;
      action.payload = _.omit(action.payload, 'id');
    }
  }
  return next(action);
}