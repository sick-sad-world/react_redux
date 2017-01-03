import * as ACTIONS from '../actions/types';
import { defaultAppState } from './defaults';

export const app = (state = defaultAppState, action) => {
  switch (action.type) {
    case ACTIONS['LOGIN']:
      return Object.assign({}, state, {
        userState: true,
        actionState: 'User loaded'
      });
    case ACTIONS['GET_USER']:
      return Object.assign({}, state, {
        userState: action.payload.id > 0,
        actionState: (action.payload.id > 0) ? 'User loaded' : defaultAppState.actionState,
        loadingStep: (action.payload.id) ? state.loadingStep + 1 : 0
      });
    case ACTIONS['LOGOUT']:
      return Object.assign({}, state, {
        userState: false,
        actionState: defaultAppState.actionState,
        loadingStep: 0
      });
    case ACTIONS['GET_ALERTS']:
      return Object.assign({}, state, {actionState: 'Alerts loaded', loadingStep: state.loadingStep + 1});
    case ACTIONS['GET_REPORTS']:
      return Object.assign({}, state, {actionState: 'Reports loaded', loadingStep: state.loadingStep + 1});
    case ACTIONS['GET_COLUMNS']:
      return Object.assign({}, state, {actionState: 'Columns loaded', loadingStep: state.loadingStep + 1});
    case ACTIONS['GET_SETS']:
      return Object.assign({}, state, {actionState: 'Sourcesets loaded', loadingStep: state.loadingStep + 1});
    case ACTIONS['GET_SOURCES']:
      return Object.assign({}, state, {actionState: 'Sources loaded', loadingStep: state.loadingStep + 1});
    case ACTIONS['SET_APP_STATE']:
      return Object.assign({}, state, {appState: action.appState});
    default:
      return state;
  }
}