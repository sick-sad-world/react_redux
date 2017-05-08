import types from './types';
import { pickBy } from 'lodash';
import { sortingOptions, defColumnData, defaultDisplay, notDataProps } from './defaults';

export function getColumnsForResults(payload) {
  return payload.find(item => (item && item.type === types.READ)).payload.map(({ id, data, open }) => ({ id, data, open }));
}

export function composeColumnData(column) {
  if (!Object.keys(column.data).length) {
    column.data = { ...defColumnData, ...column.data };
  }
  if (!column.display_settings) {
    column.display_settings = defaultDisplay;
  } else if (typeof column.display_settings === 'string') {
    column.display_settings = column.display_settings.split(',');
  }
  delete column.ID;
}

export function decomposeColumnSort(sort = defColumnData.sort) {
  const prefix = sortingOptions.sortPrefix.find(pref => sort.indexOf(pref.value) > -1);
  const property = sortingOptions.sortProperty.find(prop => sort.indexOf(prop.value) > -1);
  return {
    sort_pref: (prefix) ? prefix.value : '',
    sort_prop: (property) ? property.value : ''
  };
}

export function composeColumnSort(pref, prop) {
  return pref && prop !== 'found' ? `${pref}_${prop}` : prop;
}

export function unflatternColumnData(data) {
  return {
    id: data.id,
    name: data.name,
    display_settings: data.display_settings,
    data: {
      ...pickBy(data, (v, k) => notDataProps.indexOf(k) < 0 && ((v instanceof Array) ? v.length : v !== '')),
      ...data.advancedFilters
    }
  };
}
