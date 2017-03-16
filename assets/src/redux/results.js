import { LOGIN, LOGOUT, GET_RESULTS, GET_RESULT, SET_RESULT_STATE, ADD_RESULTS, FAVORITE_RESULT, IGNORE_RESULT, REMOVE_COLUMN } from '../helpers/types';
import createAction from '../helpers/action-factory';
import { updateObjectById } from '../helpers/reducer-factory';

export default function results(state = {}, action) {
  switch (action.type) {
    case LOGOUT:
    case LOGIN: 
      return {};
    case SET_RESULT_STATE:
      return updateObjectById(state, action.entity, (prevState) => ({
        payload: (prevState) ? prevState.payload : [],
        state: (action.hasOwnProperty('state')) ? action.state : 2
      }));
    case GET_RESULTS:
      return updateObjectById(state, action.entity, () => ({
        payload: action.payload,
        state: 2
      }));
    case GET_RESULT:
      return updateObjectById(state, action.entity, (prevState) => ({
        payload: prevState.payload.map((link) => (link.hash === action.payload.hash) ? action.payload : link),
        state: 2
      }));
    case ADD_RESULTS:
      return updateObjectById(state, action.entity, (prevState) => ({
        payload: [...prevState.payload, ...action.payload],
        state: 2
      }));
    case FAVORITE_RESULT:
      return updateObjectById(state, action.entity, (prevState) => ({
        payload: prevState.payload.map((link) => {
          if (link.hash === action.payload.hash) {
            return { ...link, favorite: (action.payload.unfavorite) ? 0 : 1 }
          } else {
            return link
          }
        }),
        state: 2
      }));
    case IGNORE_RESULT:
      return updateObjectById(state, action.entity, (prevState) => ({
        payload: prevState.payload.map((link) => {
          if (link.hash === action.payload.hash) {
            return { ...link, ignore: (action.payload.unignore) ? 0 : 1 }
          } else {
            return link
          }
        }),
        state: 2
      }));
    case REMOVE_COLUMN:
      return { ...state, [action.payload.id]: undefined }
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