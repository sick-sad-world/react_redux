import { LOGIN, LOGOUT, GET_USER, CREATE_USER, EDIT_USER } from "../actions/types";
import _ from "lodash";

export const defaultUser = {
  id: null,
  hash: "",
  email: "",
  email_bcc: [],
  name: "",
  fullname: "Name Surname",
  position: "user position",
  status: null,
  is_admin: "0",
  image: "img/ph_user.png"
};

export function user (state = {}, action) {
  switch (action.type) {
    case LOGOUT:
    case LOGIN:
      return _.clone(defaultUser);
    case GET_USER:
      return state = _.assign(state, {id: action.id}, action.payload);
    case EDIT_USER:
      return state = _.assign(state, {id: action.id}, action.payload);
    default:
      return state;
  }
}