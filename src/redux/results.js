import { LOGIN, LOGOUT, GET_RESULTS, GET_RESULT, SET_RESULT_STATE, ADD_RESULTS, FAVORITE_RESULT, IGNORE_RESULT, REMOVE_COLUMN } from '../helpers/types';
import { reduce } from 'lodash';
import createAction from '../helpers/actionFactory';

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

export default function results(state = {}, action) {
  switch (action.type) {
    case LOGOUT:
    case LOGIN: 
      return {};
    case SET_RESULT_STATE:
      return {
        ...state,
        [action.entity]: {
          payload: (state[action.entity]) ? state[action.entity].payload : [],
          state: (action.hasOwnProperty('state')) ? action.state : 2
        }
      };
    case GET_RESULTS:
      return {
        ...state,
        [action.entity]: {
          payload: action.payload.map(splitText),
          state: (action.hasOwnProperty('state')) ? action.state : 2
        }
      };
    case GET_RESULT:
      return {
        ...state,
        [action.entity]: {
          payload: state[action.entity].payload.map((link) => (link.hash === action.payload.hash) ? {...link, ...splitText(action.payload)} : link),
          state: (action.hasOwnProperty('state')) ? action.state : 2
        }
      };
    case ADD_RESULTS:
      return {
        ...state,
        [action.entity]: {
          payload: [...state[action.entity].payload, ...action.payload.map(splitText)],
          state: (action.hasOwnProperty('state')) ? action.state : 2
        }
      };
    case FAVORITE_RESULT:
      return {
        ...state,
        [action.entity]: {
          payload: state[action.entity].payload.map((link) => {
            if (link.hash === action.payload.hash) {
              return {
                ...link,
                favorite: (action.payload.unfavorite) ? 0 : 1
              }
            } else {
              return link
            }
          }),
          state: (action.hasOwnProperty('state')) ? action.state : 2
        }
      };
    case IGNORE_RESULT:
      return {
        ...state,
        [action.entity]: {
          payload: state[action.entity].payload.map((link) => {
            if (link.hash === action.payload.hash) {
              return {
                ...link,
                ignore: (action.payload.unignore) ? 0 : 1
              }
            } else {
              return link
            }
          }),
          state: (action.hasOwnProperty('state')) ? action.state : 2
        }
      };
    case REMOVE_COLUMN:
      return reduce(state, ((acc, res, id) => {
        if (parseInt(id) !== action.payload.id) acc[id] = res;
        return acc;
      }), {});
    default:
      return state;
  }
}

export const getResults = createAction({
  type: GET_RESULTS,
  state_type: SET_RESULT_STATE,
  url: 'links',
  pendingMessage: 'Fetching results for $id column...',
  successMessage: 'Results fetched successfully.'
});

export const addResults = createAction({
  type: ADD_RESULTS,
  state_type: SET_RESULT_STATE,
  url: 'links',
  pendingMessage: 'Fetching more results for $id column...',
  successMessage: 'Results added successfully.'
});

export const refreshResult = createAction({
  type: GET_RESULT,
  state_type: SET_RESULT_STATE,
  url: 'links',
  pendingMessage: 'Refreshing result $id...',
  successMessage: 'Result updated.'
});

export const ignoreResult = createAction({
  type: IGNORE_RESULT,
  state_type: SET_RESULT_STATE,
  url: 'ignore',
  pendingMessage: 'Changing state of result $id...',
  successMessage: 'Result ignorance changed.'
});

export const favoriteResult = createAction({
  type: FAVORITE_RESULT,
  state_type: SET_RESULT_STATE,
  url: 'favorite',
  pendingMessage: 'Changing state of result $id...',
  successMessage: 'Result favor changed.'
});