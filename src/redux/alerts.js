import { GET_ALERTS, ADD_ALERT, EDIT_ALERT, REMOVE_ALERT, SET_ALERT_STATE } from '../helpers/types';
import createReducer from '../helpers/reducerFactory';
import createAction from '../helpers/actionFactory';

export default createReducer({
  GET: GET_ALERTS,
  ADD: ADD_ALERT,
  EDIT: EDIT_ALERT,
  REMOVE: REMOVE_ALERT,
  STATE: SET_ALERT_STATE
});


export const setAlertsState = (state) => ({
  type: SET_ALERT_STATE,
  state
});

export const getAlerts = createAction({
  type: GET_ALERTS,
  state_type: SET_ALERT_STATE,
  url: 'alerts',
  pendingMessage: 'Reading alerts data...',
  successMessage: 'Alerts data has been read.'
});

export const createAlert = createAction({
  type: ADD_ALERT,
  state_type: SET_ALERT_STATE,
  url: 'add_alert',
  pendingMessage: 'Creating new alert...',
  successMessage: 'Alert succesfully created.'
});

export const editAlert = createAction({
  type: EDIT_ALERT,
  state_type: SET_ALERT_STATE,
  url: 'alert',
  pendingMessage: 'Updating alert data...',
  successMessage: 'Alert data has been updated.'
});

export const deleteAlert = createAction({
  type: REMOVE_ALERT,
  state_type: SET_ALERT_STATE,
  url: 'remove_alert',
  pendingMessage: 'Deleting alert...',
  successMessage: 'Alert was deleted.'
});