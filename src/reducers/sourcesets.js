import { LOGIN, LOGOUT, GET_SOURCESETS, ADD_SOURCESET, EDIT_SOURCESET, DELETE_SOURCESET } from "../actions/types";
import _ from "lodash";

export function sourcesets (state = [], action) {
  switch (action.type) {
    case LOGOUT:
    case LOGIN:
      return [];
    case GET_SOURCESETS:
      return action.payload;
    case ADD_SOURCESET:
      return _.concat(state, action.payload);
    case EDIT_SOURCESET:
      return _.map(state, (item) => {
        return (item.id === action.payload.id) ? action.payload : item;
      });
    case DELETE_SOURCESET:
      return _.reject(state, {id: action.payload.id});
    default:
      return state;
  }
}