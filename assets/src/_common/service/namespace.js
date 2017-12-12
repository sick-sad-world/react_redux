import { get, set, startsWith } from 'lodash';

const space = {};

export function createNamespace(module, ...types) {
  return types.reduce((acc, type) => {
    const p = `${module}.${type}`;
    const t = `@@${p}`;
    acc[type] = t;
    set(space, p, t);
    return acc;
  }, {});
}

const isType = s => startsWith(s, '@@');

export const pickType = (s) => {
  const type = get(space, s, s);
  if (!isType(type)) {
    console.warn(`Action type [${s}] not found`);
    return false;
  }
  return type;
};
