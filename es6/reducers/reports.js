import { ADD_REPORT, EDIT_REPORT, DELETE_REPORT } from '../actions/types';
import _ from 'lodash';

export default function reports (state = {}, action) {
  switch (action.type) {
    case ADD_REPORT:
      return {...state, [action.id]: action.payload}
    case EDIT_REPORT:
      return _.map(state, (report, id) => (id === action.id) ? _.assign({}, report, action.payload) : report);
    case DELETE_REPORT:
      return _.omit(state, action.id);
    default:
      return state;
  }
}