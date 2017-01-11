import { LOGOUT, GET_LINKS, SET_LINK_STATE } from '../actions/types';

const turncrateText = (result) => {
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

export const links = (state = {}, action) => {
  switch (action.type) {
    case LOGOUT: 
      return {};
    case SET_LINK_STATE:
      return Object.assign({}, state, {[action.id]: Object.assign({data: []}, state[action.id], {state: action.state || 2})});
    case GET_LINKS:
      return Object.assign({}, state, {
        [action.id]: {
          data: action.payload.map(turncrateText),
          state: state.state || 2
        }
      });
    default:
      return state;
  }
}