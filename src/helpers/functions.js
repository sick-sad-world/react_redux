import * as ACTIONS from '../actions/types';
import moment from 'moment';
import { isUndefined, isPlainObject, reduce, isArray } from 'lodash';

export const absolutizePath = (path) => (path && path.indexOf('/') > 0) ? '/'+path : path;

export const pickUniqueSources = (sets) => {
  let feeds = {};
  sets.forEach((set) => {
    set.source_ids.forEach((source) => {
      if (feeds.hasOwnProperty(source)) {
        ++feeds[source]
      } else {
        feeds[source] = 1;
      }
    });
  });
  return feeds;
}

export const ensureColumnData = (item, defaults) => {
  if (item) {
    item.data = Object.assign({}, defaults.data, item.data);
    if (typeof item.display_settings === 'string') {
      item.display_settings = item.display_settings.split(',');
    }
    if (!item.display_settings || !item.display_settings.length) {
      item.display_settings = defaults.display_settings;
    }
    return item;
  } else {
    return {data: {}};
  }
}

export const transformColumnValue = (value) => {
  let numVal = parseFloat(value);

  if (value === '' || value === null || (name.indexOf('is_') === 0 && value === 'on')) {
    return undefined;
  } else if (typeof numVal === 'number' && numVal === numVal) {
    return numVal
  } else {
    return value;
  }
}

export const composeColumnSort = (pref, prop) => (pref && prop !== 'found') ? pref + '_' + prop : prop;

export const setUniqueSources = (set, feeds) => {
  set.uniq_ids = [];
  set.source_ids.forEach((source) => {
    if (feeds[source] === 1) {
      set.uniq_ids.push(source);
    }
  });
}

export const splitText = (result) => {
  let limit = 120;
  let index = {
    max: Math.round(limit * 1.25),
    min: Math.round(limit * 0.75),
    curr: -1,
    isValid: function() {
      return this.curr >= 0 && (this.curr <= this.max || this.curr >= this.min);
    }
  };

  result.additional = '';
  if ((typeof result.description === 'string') && result.description.length > Math.round(limit * 1.75)) {
    index.curr = result.description.search(/[\.\?\!]\s/);
    if (!index.isValid()) {
      index.curr = result.description.indexOf(' ', limit);
      if (!index.isValid()) {
        index.curr = limit;
      }
    } else {
      index.curr = index.curr + 2;
    }
    if (index.curr >= 0) {
      result.additional = result.description.substring(index.curr, result.description.length);
      result.description = result.description.substring(0, index.curr);
    }
  }
  return result;
}

export const updateArrayWithValue = (arr, val) => {
  let result = [];
  let inArray = false;

  arr.forEach((item, i) => {
    if (item === val) {
      inArray = true;
    } else {
      result.push(item);
    }
  });

  if (!inArray) {
    result.push(val);
  }

  return result;
}

export const inject = (target, mixin) => {
  for (let key in mixin) {
    if (key !== '_inject' && !(target[key] instanceof Function)) {
      target[key] = mixin[key].bind(target);
    }
  } 
}

export const formatNumber = (num, gap = 1) => {
    if (typeof num !== 'number') {
      return false;
    } else if (num < 1000) {
      return num + '';
    } else if (num >= 1000 && num < 1000000) {
      return Math.round(num / 1000).toFixed(gap) + 'K';
    } else if (num >= 1000000 && num < 1000000000) {
      return Math.round(num / 1000000).toFixed(gap) + 'M';
    } else if (num >= 1000000000) {
      return Math.round(num / 1000000000).toFixed(gap) + 'B';
    } else {
      return num;
    }
}

export const makeSortLabel = (stat = '') => {
  stat = stat.replace('_views', '');
  if (stat.indexOf('rate_') === 0) {
    stat = stat.replace('rate_', '') + '/hr';
  } else if (stat.indexOf('maxrate_') === 0) {
    stat = stat.replace('maxrate_', 'max ') + '/hr';
  } else if (stat.indexOf('hotness_') === 0) {
    stat = stat.replace('hotness_', 'hot ');
  }
  return stat;
}

export const transformRequestData = (data, id) => reduce(data, (acc, v, k) => {
  if (isPlainObject(v)) {
    acc[k] = JSON.stringify(v);
  } else if (isArray(v)) {
    if (v.length) {
      acc[k] = v;
    }
  } else if (!isUndefined(v)) {
    acc[k] = v;
  }
  return acc;
}, (id) ? { id } : {});

export const compileRequstParams = (entity, code, id) => {
  let data = {};
  switch (code) {
    case 3:
      if (id) {
        data.url = entity;
        data.type = ACTIONS[`GET_${entity.toUpperCase()}`];
      } else {
        data.url = entity + 's';
        data.type = ACTIONS[`GET_${entity.toUpperCase()}S`];
      }
      break;
    case 4:
      data.url = 'add_' + entity;
      data.type = ACTIONS[`ADD_${entity.toUpperCase()}`];
      break;
    case 5:
      data.url = entity;
      data.type = ACTIONS[`EDIT_${entity.toUpperCase()}`];
      break;
    case 6:
      data.url = 'remove_' + entity;
      data.type = ACTIONS[`REMOVE_${entity.toUpperCase()}`];
      break;
    case 7:
      data.url = `sort_${entity}s`;
      data.type = ACTIONS[`SORT_${entity.toUpperCase()}S`];
      break;
    case 8:
      data.url = entity;
      data.type = ACTIONS[`${entity.toUpperCase()}`];
      break;
    default:
      throw {
        text: 'Action code incorrect. Should be between 3 and 8'
      }
  }
  return data;
}

export const createMessage = (data) => Object.assign({visible: true, id: moment().unix()}, data);

export const transformError = (error) => {
  if (error instanceof Error) {
    console.error(error.toString()+' '+error.stack);
    return {type: 'error', text: error.toString()+' '+error.stack};
  } else {
    return {...error, type: 'error'};
  }
}