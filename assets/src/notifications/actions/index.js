import moment from 'moment';
import types from '../types';

export default note => dispatch => dispatch({
  type: types.NOTIFICATION,
  payload: {
    id: moment().unix(),
    type: 'info',
    visible: true,
    ...note
  }
});
