import { LOGIN, LOGOUT } from "../actions/types";
import { map, reject, concat } from "lodash";

export default function basicReducer (actions) {
  return function (state = {}, action) {
    switch (action.type) {
      case LOGOUT:
      case LOGIN:
        return [];
      case actions.GET:
        return action.payload;
      case actions.ADD:
        return concat(state, action.payload);
      case actions.EDIT:
        return map(state, (item) => {
          return (item.id === action.payload.id) ? action.payload : item;
        });
      case actions.DELETE:
        return reject(state, {id: action.payload.id});
      default:
        return state;
    }
  }
}