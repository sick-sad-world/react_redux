import { LOGIN, LOGOUT, GET_COLUMNS, ADD_COLUMN, EDIT_COLUMN, DELETE_COLUMN } from "../actions/types";
import _ from "lodash";

export function columns (state = {}, action) {
  switch (action.type) {
    case LOGOUT:
    case LOGIN:
      return [];
    case GET_COLUMNS:
      return action.payload;
    case ADD_COLUMN:
      return _.concat(state, action.payload);
    case EDIT_COLUMN:
      return _.map(state, (item) => {
        return (item.id === action.payload.id) ? action.payload : item;
      });
    case DELETE_COLUMN:
      return _.reject(state, {id: action.payload.id});
    default:
      return state;
  }
}