import createTypes from 'common/type-factory';

export default createTypes('app', {
  CREATE: undefined,
  READ: undefined,
  UPDATE: undefined,
  DELETE: undefined,
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  ERROR: 'ERROR'
});
