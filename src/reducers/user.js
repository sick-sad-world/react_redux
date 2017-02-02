import { GET_USER, EDIT_USER, SET_USER_STATE, LOGOUT } from '../actions/types';

export const defaultUser = {
  state: 1,
  payload: {
    id: 0,
    email: '',
    email_bcc: [],
    name: '',
    fullname: '',
    position: '',
    status: '',
    is_admin: 0,
    image: '/img/ph_user.png'
  }
}

export default function reducer (state = {...defaultUser}, action) {
  switch (action.type) {
    case SET_USER_STATE:
      return {...state, state: action.state};
    case EDIT_USER:
    case GET_USER:
      return {...state, state: 2, payload: action.payload}
    case LOGOUT:
      return {...defaultUser};
    default:
      return state;
  }
}

