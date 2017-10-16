import createAction from 'common/action-factory';
import types from './types';
import { LOGIN, LOGOUT } from 'common/type-factory';

export const login = createAction({
  action: LOGIN,
  loading: types.STATE,
  call: 'login'
});

export const logout = createAction({
  action: LOGOUT,
  loading: types.STATE,
  call: 'logout'
});

export const addUser = createAction({
  action: types.CREATE,
  loading: types.STATE,
  call: 'add_user'
});

export const getUser = createAction({
  action: types.READ,
  loading: types.STATE,
  call: 'user'
});

export const editUser = createAction({
  action: types.UPDATE,
  loading: types.STATE,
  call: 'user'
});
