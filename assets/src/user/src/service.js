import fetch from 'src/communication';
import createService from 'common/service-pool';
import defaultApp from './defaults';

// Create action types and context
// ===========================================================================
const { types, addAction, createReducer } = createService('user', 'read', 'create', 'edit', 'delete', 'login', 'logout');

export default createReducer({
  [types.logout]: state => ({ ...defaultApp }),
  [types.read]: 'read',
  [types.create]: 'create',
  [types.edit]: 'edit',
  [types.delete]: 'delete'
}, defaultApp);

export const login = addAction([types.login], 'login');

export const logout = addAction([types.logout], 'logout');

export const getUser = addAction([types.read], (params, opts, { dispatch }) => fetch('user', params, opts));

export const addUser = addAction([types.create], 'add_user');

export const editUser = addAction([types.edit], 'user');
