import createAction from 'common/action-factory';
import types from './types';
import { LOGIN, LOGOUT } from 'common/type-factory';

export const login = createAction({
  type: LOGIN,
  state_type: types.STATE,
  url: 'login',
  pendingMessage: 'Check auth credentials...',
  successMessage: 'Logged in.'
});

export const logout = createAction({
  type: LOGOUT,
  state_type: types.STATE,
  url: 'logout',
  pendingMessage: 'Shutting down session...',
  successMessage: 'Logged out.'
});

export const addUser = createAction({
  type: types.CREATE,
  state_type: types.STATE,
  url: 'add_user',
  pendingMessage: 'Registering new user...',
  successMessage: 'New user has been created.'
});

export const getUser = createAction({
  type: types.READ,
  state_type: types.STATE,
  url: 'user',
  pendingMessage: 'Reading user data...',
  successMessage: 'User data has been read.'
});

export const editUser = createAction({
  type: types.UPDATE,
  state_type: types.STATE,
  url: 'user',
  pendingMessage: 'Updating user data...',
  successMessage: 'User data has been updated.'
});
