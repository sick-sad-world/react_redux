import { mapValues } from 'lodash';

const defaults = {
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  STATE: 'STATE',
  SORT: 'SORT',
  ERROR: 'ERROR'
};

export default function createTypes(module, actions) {
  if (!module) {
    throw new Error('Provide module path or designation to mark action contants');
  }
  return Object.freeze(mapValues({
    ...defaults,
    ...actions
  }, v => `@@${module}/${v}`));
}

export const LOGIN = '@@system/LOGIN';
export const LOGOUT = '@@system/LOGOUT';
