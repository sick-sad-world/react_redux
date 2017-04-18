import { LOGIN, LOGOUT, ERROR, STATE } from 'common/type-factory';
import defaultApp from './defaults';

export default (state = { ...defaultApp }, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loadingStep: defaultApp.loadingStep,
        state: 1
      };
    // case ACTIONS.GET_ALERTS:
    // case ACTIONS.GET_REPORTS:
    // case ACTIONS.GET_SETS:
    // case ACTIONS.GET_SOURCES:
    // case ACTIONS.GET_COLUMNS:
    //   return {...state, loadingStep: state.loadingStep + 1 }
    case ERROR:
      return {
        ...state,
        state: 0,
        error: action.error
      };
    case STATE:
      return {
        ...state,
        state: action.state
      };
    default:
      return state;
  }
};
