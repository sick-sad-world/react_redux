import types from './types';
import { sortingOptions, defColumnData, loDashRegExp } from './defaults';
import DisplaySettings from 'src/display-settings';

export function getColumnsForResults(payload) {
  return payload.find(item => (item && item.type === types.READ)).payload.map(({ id, data, open }) => ({ id, data, open }));
}

export function ensureDisplaySettings(s) {
  if (!s) {
    return DisplaySettings.getDefault();
  } else if (typeof s === 'string') {
    return s.split(',');
  }
  return s;
}

export function normalizeDisplaySettings(s) {
  if (s === '_videoviews') return 'views_video';
  return s.replace(loDashRegExp, '_');
}

export function composeColumnData({ data, display_settings, ...column }) {
  return {
    ...column,
    display_settings: ensureDisplaySettings(display_settings).map(normalizeDisplaySettings),
    data: {
      ...defColumnData,
      ...data,
      infinite: (data.infinite) ? 1 : 0,
      set: (typeof data.set === 'number') ? [data.set] : data.set,
      source: (typeof data.source === 'number') ? [data.source] : data.source
    }
  };
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

