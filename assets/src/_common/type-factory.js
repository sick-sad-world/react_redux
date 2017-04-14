import { mapValues } from 'lodash';

export default function createTypes(module, actions) {
  if (!module) {
    throw new Error('Provide module path or designation to mark action contants');
  }
  return Object.freeze(mapValues({
    CREATE: 'CREATE',
    READ: 'READ',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    STATE: 'STATE',
    ...actions,
  }, v => `@@${module}/${v}`));
}
