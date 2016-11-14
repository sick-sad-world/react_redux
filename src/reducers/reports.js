import { GET_REPORTS, ADD_REPORT, EDIT_REPORT, DELETE_REPORT } from "../actions/types";
import _ from "lodash";

export function reports (state = {}, action) {
  switch (action.type) {
    case GET_REPORTS:
      return _.assign({}, state, action.payload);
    case ADD_REPORT:
      return {...state, [action.id]: action.payload};
    case EDIT_REPORT:
      return {...state, [action.id]: _.assign({}, state[action.id], action.payload)};
    case DELETE_REPORT:
      return _.omit(state, action.id);
    default:
      return state;
  }
}