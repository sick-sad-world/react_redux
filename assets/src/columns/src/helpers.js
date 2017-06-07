import types from './types';
import { sortingOptions, defColumnData } from './defaults';
import { displaySettings } from 'src/results';

export function getColumnsForResults(payload) {
  return payload.find(item => (item && item.type === types.READ)).payload.map(({ id, data, open }) => ({ id, data, open }));
}

export function composeColumnData({ id, name, data, order, display_settings, open }) {
  let settings = display_settings;
  const loDashRegExp = /_+/;
  if (!settings) {
    settings = [...displaySettings.default];
  } else if (typeof settings === 'string') {
    settings = settings.split(',');
  }

  return {
    id,
    name,
    open,
    order,
    display_settings: settings.map((setting) => {
      if (setting === '_videoviews') return 'views_video';
      return setting.replace(loDashRegExp, '_');
    }),
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

