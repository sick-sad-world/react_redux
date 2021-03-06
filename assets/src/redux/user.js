import { LOGIN, LOGOUT, GET_USER, ADD_USER, EDIT_USER, SET_USER_STATE } from '../helpers/types';
import createAction from '../helpers/action-factory';

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
      return {
        ...state,
        state: action.state
      }
    case EDIT_USER:
    case GET_USER:
    case ADD_USER:
      return {
        ...state,
        state: 2,
        payload: {...state.payload, ...action.payload, image: 'img/ph_user.png'}
      }
    case LOGOUT:
      return {
        ...defaultUser
      }
    default:
      return state;
  }
}

export const setUserState = (state) => ({
  type: SET_USER_STATE,
  state
});

export const login = createAction({
  type: LOGIN,
  state_type: null,
  url: 'login',
  pendingMessage: 'Check auth credentials...',
  successMessage: 'Logged in.'
});

export const logout = createAction({
  type: LOGOUT,
  state_type: null,
  url: 'logout',
  pendingMessage: 'Shutting down session...',
  successMessage: 'Logged out.'
});

export const addUser = createAction({
  type: ADD_USER,
  state_type: SET_USER_STATE,
  url: 'add_user',
  pendingMessage: 'Registering new user...',
  successMessage: 'New user has been created.'
});

export const getUser = createAction({
  type: GET_USER,
  state_type: SET_USER_STATE,
  url: 'user',
  pendingMessage: 'Reading user data...',
  successMessage: 'User data has been read.'
});

export const editUser = createAction({
  type: EDIT_USER,
  state_type: SET_USER_STATE,
  url: 'user',
  pendingMessage: 'Updating user data...',
  successMessage: 'User data has been updated.'
});