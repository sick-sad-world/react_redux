import * as ACTIONS from './types';
import moment from 'moment';
import createAction from './factory';
import { getColumns } from './columns';
import { getSets } from './sets';
import { getSources } from './sources';
import { getAlerts } from './alerts';
import { getReports } from './reports';

export const notification = (note) => (dispatch) => dispatch({
  type: ACTIONS.PUSH_NOTIFICATION,
  payload: {
    id: moment().unix(),
    type: 'info',
    visible: true,
    ...note
  }
});

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

export const setUserState = (state) => ({
  type: ACTIONS.SET_USER_STATE,
  state
});

export const getUser = createAction({
  type: ACTIONS.GET_USER,
  state_type: ACTIONS.SET_USER_STATE,
  url: 'user',
  pendingMessage: 'Reading user data...',
  successMessage: 'User data has been read.'
});

export const editUser = createAction({
  type: ACTIONS.EDIT_USER,
  state_type: ACTIONS.SET_USER_STATE,
  url: 'user',
  pendingMessage: 'Updating user data...',
  successMessage: 'User data has been updated.'
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