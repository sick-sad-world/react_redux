import * as ACTIONS from '../actions/types';
import { defaultAppState } from './defaults';

export const app = (state = defaultAppState, action) => {
  switch (action.type) {
    case ACTIONS['LOGIN']:
    case ACTIONS['GET_USER']:
      let logInSuccess =  action.type === ACTIONS['LOGIN'] || action.payload.id > 0;
      return Object.assign({}, state, {
        userState:logInSuccess,
        loadingState: (logInSuccess) ? 'User loaded' : defaultAppState.loadingState,
        loadingStep: 1
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