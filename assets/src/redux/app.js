import * as ACTIONS from '../helpers/types';
import { getColumns } from './columns';
import { getSets } from './sets';
import { getSources } from './sources';
import { getAlerts } from './alerts';
import { getReports } from './reports';

export const defaultApp = {
  state: 1,
  loadingStep: 1,
  error: null
}

export default function reducer (state = {...defaultApp}, action) {
  switch (action.type) {
    case ACTIONS.GET_ALERTS:
    case ACTIONS.GET_REPORTS:
    case ACTIONS.GET_SETS:
    case ACTIONS.GET_SOURCES:
    case ACTIONS.GET_COLUMNS:
      return {...state, loadingStep: state.loadingStep + 1 }
    case ACTIONS.ERROR:
      return {
        ...state,
        state: 0,
        error: action.error
      }
    case ACTIONS.SET_APP_STATE:
      return {
        ...state,
        state: action.state
      }
    default:
      return state;
  }
}

export const clientError = (error) => (dispatch) => dispatch({
  type: ACTIONS.ERROR,
  error: (error instanceof Error) ? error.stack : error
});

export const setAppState = (state) => (dispatch) => dispatch({
  type: ACTIONS.SET_APP_STATE,
  state: state
});

export const fetchData = (options) => {

  options = {
    ...options,
    state: false,
    notification: false
  };

  return (dispatch) => Promise.all([
    dispatch(getColumns({data: 1}, options)),
    dispatch(getSets(null, options)),
    dispatch(getSources(null, options)),
    dispatch(getAlerts(null, options)),
    dispatch(getReports(null, options))
  ]);
}
