import types from './types';
import { sortingOptions, defColumnData } from './defaults';
import DisplaySettings from 'src/display-settings';
import { parseOrder } from 'functions';

const loDashRegExp = /_+/;

// Get columns to fetch results (Used on init loading)
// ===========================================================================
export function getColumnsForResults(payload) {
  return payload.find(item => (item && item.type === types.READ)).payload.map(({ id, data, open }) => ({ id, data, open }));
}

// Split string (old ui) or provide default ones
// ===========================================================================
export function ensureDisplaySettings(s) {
  if (!s) {
    return DisplaySettings.getDefault();
  } else if (typeof s === 'string' && s.indexOf(',') > -1) {
    return s.split(',');
  }
  return s;
}

// Remove multiple lodashes from values (bug result from old ui)
// ===========================================================================
export function normalizeDisplaySettings(s) {
  if (s === '_videoviews') return 'views_video';
  return s.replace(loDashRegExp, '_');
}

// Make required column object on UI (used in middleware)
// ===========================================================================
export function composeColumnData({ data, display_settings, order, ...column }) {
  const ds = ensureDisplaySettings(display_settings);
  const result = {
    ...column,
    order: parseOrder(order),
    display_settings: (Array.isArray(ds)) ? ds.map(normalizeDisplaySettings) : ds
  };

  // Compose default and providen data
  // ===========================================================================
  if (data) {
    result.data = {
      ...defColumnData,
      ...data,
      infinite: (data.infinite) ? 1 : 0,
      set: (typeof data.set === 'number') ? [data.set] : data.set,
      source: (typeof data.source === 'number') ? [data.source] : data.source
    };
  }

  return result;
}

// Split sort param on prefix and param itself (used for diff fields)
// ===========================================================================
export function decomposeColumnSort(sort = defColumnData.sort) {
  const prefix = sortingOptions.sortPrefix.find(pref => sort.indexOf(pref.value) > -1);
  const property = sortingOptions.sortProperty.find(prop => sort.indexOf(prop.value) > -1);
  return {
    sort_pref: (prefix) ? prefix.value : null,
    sort_prop: (property) ? property.value : ''
  };
}

// Put sorting together
// ===========================================================================
export function composeColumnSort(pref, prop) {
  return pref && prop !== 'found' ? `${pref}_${prop}` : prop;
}

