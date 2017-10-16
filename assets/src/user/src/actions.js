import createAction from 'common/action-factory';
import types from './types';
import { LOGIN, LOGOUT } from 'common/type-factory';

export const login = createAction({
  action: LOGIN,
  call: 'login'
});

export const logout = createAction({
  action: LOGOUT,
  call: 'logout'
});

export const addUser = createAction({
  action: types.CREATE,
  call: 'add_user'
});

export const getUser = createAction({
  action: types.READ,
  call: 'user'
});

export const editUser = createAction({
  action: types.UPDATE,
  call: 'user'
});
