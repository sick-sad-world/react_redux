import * as ACTIONS from '../actions/types';
import { defaultAppState } from './defaults';

export const app = (state = defaultAppState, action) => {
  switch (action.type) {
    case ACTIONS['LOGIN']:
      return Object.assign({}, state, {
        userState: true,
        loadingState: 'User loaded'
      });
    case ACTIONS['GET_USER']:
      return Object.assign({}, state, {
        userState: action.payload.id > 0,
        loadingState: (action.payload.id > 0) ? 'User loaded' : defaultAppState.loadingState,
        loadingStep: (action.payload.id) ? state.loadingStep + 1 : 0
      });
    case ACTIONS['LOGOUT']:
      return Object.assign({}, state, {
        userState: false,
        loadingState: defaultAppState.loadingState,
        loadingStep: 0
      });
    case ACTIONS['GET_ALERTS']:
      return Object.assign({}, state, {loadingState: 'Alerts loaded', loadingStep: state.loadingStep + 1});
    case ACTIONS['GET_REPORTS']:
      return Object.assign({}, state, {loadingState: 'Reports loaded', loadingStep: state.loadingStep + 1});
    case ACTIONS['GET_COLUMNS']:
      return Object.assign({}, state, {loadingState: 'Columns loaded', loadingStep: state.loadingStep + 1});
    case ACTIONS['GET_SETS']:
      return Object.assign({}, state, {loadingState: 'Sourcesets loaded', loadingStep: state.loadingStep + 1});
    case ACTIONS['GET_SOURCES']:
      return Object.assign({}, state, {loadingState: 'Sources loaded', loadingStep: state.loadingStep + 1});
    case ACTIONS['SET_APP_STATE']:
      return Object.assign({}, state, {appState: action.appState});
    default:
      return state;
  }
}