import types from '../types';

export function splitText(result) {
  const limit = 120;
  const index = {
    max: Math.round(limit * 1.25),
    min: Math.round(limit * 0.75),
    curr: -1,
    isValid() {
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
      index.curr += 2;
    }
    if (index.curr >= 0) {
      result.additional = result.description.substring(index.curr, result.description.length);
      result.description = result.description.substring(0, index.curr);
    }
  }
  return result;
}

export default ({ dispatch, getState }) => next => (action) => {
  if (action.type === types.READ || action.type === types.PUSH) {
    action.payload.forEach(splitText);
  } else if (action.type === types.UPDATE) {
    splitText(action.payload);
  }
  return next(action);
};
