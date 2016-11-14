import { GET_USER, CREATE_USER, EDIT_USER } from "../actions/types";
import _ from "lodash";

export function user (state = {}, action) {
  switch (action.type) {
    case GET_USER:
      return state.user = _.assign({id: action.id}, state.user, action.payload);
    case EDIT_USER:
      return state.user = _.assign({id: action.id}, state.user, action.payload);
    default:
      return state;
  }
}