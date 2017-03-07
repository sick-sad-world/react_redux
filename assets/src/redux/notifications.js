import { mergeArrayById } from '../helpers/reducer-factory';
import { PUSH_NOTIFICATION } from '../helpers/types';
import moment from 'moment';

export default function reducer (state = [], action) {
  switch (action.type) {
    case PUSH_NOTIFICATION:
      return mergeArrayById(state, action.payload);
    default:
      return state;
  }
}

export const notification = (note) => (dispatch) => dispatch({
  type: PUSH_NOTIFICATION,
  payload: {
    id: moment().unix(),
    type: 'info',
    visible: true,
    ...note
  }
});