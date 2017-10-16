import createTypes, { LOGIN, LOGOUT } from 'common/type-factory';

export default createTypes('application', {
  STATE: 'STATE',
  CREATE: undefined,
  UPDATE: undefined,
  DELETE: undefined,
  READ: undefined,
  SORT: undefined
});

export { LOGIN };

export { LOGOUT };
