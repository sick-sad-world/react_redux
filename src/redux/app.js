import * as ACTIONS from '../helpers/types';
import createAction from '../helpers/actionFactory';
import { notification } from './notifications';
import { getColumns } from './columns';
import { getSets } from './sets';
import { getSources } from './sources';
import { getAlerts } from './alerts';
import { getReports } from './reports';

export const defaultApp = {
  state: 1,
  loadingStep: 1,
  userAuthenticated: false
}

export default function reducer (state = defaultApp, action) {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return {...state, userAuthenticated: true}
    case ACTIONS.LOGOUT:
      return {...state, userAuthenticated: false}
    case ACTIONS.GET_USER:
      return {...state, userAuthenticated: !!action.payload.id}
    case ACTIONS.SET_APP_STATE:
      return {...state, state: action.state}
    default:
      return state;
  }
}

export const errorHandler = (error) => (dispatch) => {
  if (error instanceof Error || error.event) {
    throw error;
  } else {
    // Create notification of process failed ending
    // ===========================================================================
    if (error.id) dispatch(notification({
      id: error.id,
      type: 'error',
      text: error.text
    }));
    
    // Set User state to ERROR
    // ===========================================================================
    if (error.state_type) {
      dispatch({
        type: error.state_type,
        state: 0
      });  
    }
  }
};

export const setAppState = (state) => (dispatch) => dispatch({
  type: ACTIONS.SET_APP_STATE,
  state: state
});

export const login = createAction({
  type: ACTIONS.LOGIN,
  state_type: null,
  url: 'login',
  pendingMessage: 'Check auth credentials...',
  successMessage: 'Logged in.'
});

export const logout = createAction({
  type: ACTIONS.LOGOUT,
  state_type: null,
  url: 'logout',
  pendingMessage: 'Shutting down session...',
  successMessage: 'Logged out.'
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