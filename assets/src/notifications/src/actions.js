import moment from 'moment';
import types from './types';

export function notification(note) {
  return dispatch => dispatch({
    type: types.NOTIFICATION,
    payload: {
      id: moment().unix(),
      type: 'info',
      visible: true,
      ...note
    }
  });
}
