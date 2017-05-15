import createAction from 'common/action-factory';
import types from './types';

export const setAlertsState = state => ({
  type: types.STATE,
  state
});

export const getAlerts = createAction({
  type: types.READ,
  state_type: types.STATE,
  url: 'alerts',
  pendingMessage: 'Reading alerts data...',
  successMessage: 'Alerts data has been read.'
});

export const sortAlerts = createAction({
  type: types.SORT,
  state_type: types.STATE,
  url: 'sort_alerts',
  pendingMessage: 'Saving new Alerts order...',
  successMessage: 'Alerts order has been read.'
});

export const createAlert = createAction({
  type: types.CREATE,
  state_type: types.STATE,
  url: 'add_alert',
  pendingMessage: 'Creating new alert...',
  successMessage: 'Alert succesfully created.'
});

export const editAlert = createAction({
  type: types.UPDATE,
  state_type: types.STATE,
  url: 'alert',
  pendingMessage: 'Updating alert data...',
  successMessage: 'Alert data has been updated.'
});

export const deleteAlert = createAction({
  type: types.DELETE,
  state_type: types.STATE,
  url: 'remove_alert',
  pendingMessage: 'Deleting alert...',
  successMessage: 'Alert was deleted.'
});
