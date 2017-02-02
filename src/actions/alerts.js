import { GET_ALERTS, ADD_ALERT, EDIT_ALERT, DELETE_ALERT, SET_ALERT_STATE } from './types';
import createAction from './factory';

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