import * as ACTIONS from '../actions/types';
import { defaultAppState } from '../helpers/defaults';

export const app = (state = defaultAppState, action) => {
  switch (action.type) {
    case ACTIONS['GET_ALERTS']:
      return Object.assign({}, state, {
        loadingStep: state.loadingStep + 1
      });
    case ACTIONS['GET_REPORTS']:
      return Object.assign({}, state, {
        loadingStep: state.loadingStep + 1
      });
    case ACTIONS['GET_SETS']:
      return Object.assign({}, state, {
        loadingStep: state.loadingStep + 1
      });
    case ACTIONS['GET_SOURCES']:
      return Object.assign({}, state, {
        loadingStep: state.loadingStep + 1
      });
    case ACTIONS['GET_COLUMNS']:
      return Object.assign({}, state, {
        loadingStep: state.loadingStep + 1
      });
    case ACTIONS['LOGIN']:
      return Object.assign({}, state, {
        userState: true,
        loadingStep: 1
      });
    case ACTIONS['LOGOUT']:
      return Object.assign({}, state, {
        userState: false,
        loadingStep: 0
      });
    case ACTIONS['GET_USER']:
      return Object.assign({}, state, {
        userState: action.payload.id > 0,
        loadingStep: (action.payload.id) ? state.loadingStep + 1 : 0
      });
    case ACTIONS['SET_APP_STATE']:
      return Object.assign({}, state, {
        state: action.state,
      });
    case ACTIONS['ERROR']:
      return Object.assign({}, state, {
        state: 0,
         messages: [action.payload, ...state.messages]
      });
    case ACTIONS['MESSAGE']:
      return Object.assign({}, state, {
        messages: [action.payload, ...state.messages]
      })
    default:
      return state;
  }
}