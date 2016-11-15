import { LOGIN, LOGOUT, GET_COLUMNS, ADD_COLUMN, EDIT_COLUMN, DELETE_COLUMN } from "../actions/types";
import _ from "lodash";

export function columns (state = {}, action) {
  switch (action.type) {
    case LOGOUT:
    case LOGIN:
      return {};
    case GET_COLUMNS:
      return _.assign({}, state, action.payload);
    case ADD_COLUMN:
      return {...state, [action.id]: action.payload};
    case EDIT_COLUMN:
      return {...state, [action.id]: _.assign({}, state[action.id], action.payload)};
    case DELETE_COLUMN:
      return _.omit(state, action.id);
    default:
      return state;
  }
}