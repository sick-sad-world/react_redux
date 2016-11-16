import { LOGIN, LOGOUT, GET_REPORTS, ADD_REPORT, EDIT_REPORT, DELETE_REPORT } from "../actions/types";
import _ from "lodash";

export function reports (state = {}, action) {
  switch (action.type) {
    case LOGOUT:
    case LOGIN:
      return [];
    case GET_REPORTS:
      return action.payload;
    case ADD_REPORT:
      return _.concat(state, action.payload);
    case EDIT_REPORT:
      return _.map(state, (item) => {
        return (item.id === action.payload.id) ? action.payload : item;
      });
    case DELETE_REPORT:
      return _.reject(state, {id: action.payload.id});
    default:
      return state;
  }
}