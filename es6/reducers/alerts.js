import { GET_ALERTS, ADD_ALERT, EDIT_ALERT, DELETE_ALERT } from '../actions/types';
import _ from 'lodash';

export const defaultAlert = {
  owner_id: 0,
  order: 0,
  active: 1,
  name: '',
  columns: '[]',
  frequency: 15,
  next_check: '',
  last_sent: '',
  via_mail: true,
  via_twitter: false,
  recipient: ''
};

export function alerts (state = {}, action) {
  let id;
  let alerts;
  switch (action.type) {
    case GET_ALERTS:
      alerts = {};
      action.payload.forEach(item => {
        alerts[item.id] = _.omit(item, 'id');
      });
      return {...state, alerts: alerts};
    case ADD_ALERT:
      id = action.payload.id;
      return {...state, alerts: {...state.alerts, [id]: _.assign({}, defaultAlert, _.omit(action.payload, 'id'))}};
    case EDIT_ALERT:
      id = action.payload.id;
      return {...state, alerts: {...state.alerts, [id]: _.assign({}, state.alerts[id], _.omit(action.payload, 'id'))}};
    case DELETE_ALERT:
      return {...state, alerts: _.omit(state.alerts, action.payload.id)};
    default:
      return state;
  }
}