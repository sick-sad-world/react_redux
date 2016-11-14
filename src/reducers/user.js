import { GET_USER, CREATE_USER, EDIT_USER } from "../actions/types";
import _ from "lodash";

export function user (state = {}, action) {
  console.log("user", state);
  switch (action.type) {
    case GET_USER:
      return state = _.assign({id: action.id}, state, action.payload);
    case EDIT_USER:
      return state = _.assign({id: action.id}, state, action.payload);
    default:
      return state;
  }
}