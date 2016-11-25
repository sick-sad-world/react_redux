import { LOGIN, LOGOUT, GET_USER, CREATE_USER, EDIT_USER } from '../actions/types';

export const user = (state = {}, action) => {
  switch (action.type) {
    case LOGOUT:
    case LOGIN:
      return {
        id: null,
        hash: '',
        email: '',
        email_bcc: [],
        name: '',
        fullname: 'Name Surname',
        position: 'user position',
        status: null,
        is_admin: '0',
        image: 'img/ph_user.png'
      };
    case GET_USER:
      return state = Object.assign(state, action.payload);
    case EDIT_USER:
      return state = Object.assign(state, action.payload);
    default:
      return state;
  }
}