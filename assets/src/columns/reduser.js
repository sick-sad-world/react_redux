import createReducer from 'common/reducer-factory';
import types from './types';
import { defColumnSorting, defColumnData } from './defaults';

export default createReducer(types);

export const decomposeColumnSort = (sort = defColumnData.sort) => {
  const prefix = find(defColumnSorting.sortPrefix, pref => sort.indexOf(pref.value) > -1);
  const property = find(defColumnSorting.sortProperty, prop => sort.indexOf(prop.value) > -1);
  return {
    sort_pref: (prefix) ? prefix.value : '',
    sort_prop: (property) ? property.value : ''
  };
};

export const composeColumnSort = (pref, prop) => (pref && prop !== 'found' ? `${pref}_${prop}` : prop);
