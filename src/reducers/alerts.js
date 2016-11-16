import { LOGIN, LOGOUT, GET_ALERTS, ADD_ALERT, EDIT_ALERT, DELETE_ALERT } from "../actions/types";
import _ from "lodash";

export function alerts (state = [], action) {
  switch (action.type) {
    case LOGOUT:
    case LOGIN:
      return [];
    case GET_ALERTS:
      return action.payload;
    case ADD_ALERT:
      return _.concat(state, action.payload);
    case EDIT_ALERT:
      return _.map(state, (item) => {
        return (item.id === action.payload.id) ? action.payload : item;
      });
    case DELETE_ALERT:
      return _.reject(state, {id: action.payload.id});
    default:
      return state;
  }
}