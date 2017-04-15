import types from './types';

export function getColumnsForResults(payload) {
  return payload.find(item => (item && item.type === types.READ)).payload.map(({ id, data, open }) => ({ id, data, open }));
}
