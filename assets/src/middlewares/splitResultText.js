import { GET_RESULTS, GET_RESULT, ADD_RESULTS } from '../helpers/types';

export const splitText = (result) => {
  let limit = 120;
  let index = {
    max: Math.round(limit * 1.25),
    min: Math.round(limit * 0.75),
    curr: -1,
    isValid: function() {
      return this.curr >= 0 && (this.curr <= this.max || this.curr >= this.min);
    }
  };

  result.additional = '';
  if ((typeof result.description === 'string') && result.description.length > Math.round(limit * 1.75)) {
    index.curr = result.description.search(/[\.\?\!]\s/);
    if (!index.isValid()) {
      index.curr = result.description.indexOf(' ', limit);
      if (!index.isValid()) {
        index.curr = limit;
      }
    } else {
      index.curr = index.curr + 2;
    }
    if (index.curr >= 0) {
      result.additional = result.description.substring(index.curr, result.description.length);
      result.description = result.description.substring(0, index.curr);
    }
  }
  return result;
}

export default ({dispatch, getState}) => (next) => (action) => {
  if (action.type === GET_RESULTS || action.type === ADD_RESULTS) {
    action.payload.map(splitText);
  } else if (action.type === GET_RESULT) {
    splitText(action.payload);
  }
  return next(action);
}