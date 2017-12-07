import { toNumber, get } from 'lodash';

export const numOrString = (str, base = 10) => {
  const int = parseFloat(str, base);
  return (isNaN(int)) ? str : int;
};

export const parseOrder = order => (typeof order === 'string') ? parseInt(order, 10) || -1 : order;

export const updateArrayWithValue = (arr, val) => {
  const result = [];
  let inArray = false;

  arr.forEach((item) => {
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
};

export const sortParamToShort = (param = '') => {
  let stat = param.replace('_views', '');
  if (stat.indexOf('rate_') === 0) {
    stat = `${stat.replace('rate_', '')}/hr`;
  } else if (stat.indexOf('maxrate_') === 0) {
    stat = `${stat.replace('maxrate_', 'max ')}/hr`;
  } else if (stat.indexOf('hotness_') === 0) {
    stat = stat.replace('hotness_', 'hot ');
  }
  return stat;
};

export const normalizeValue = (v) => {
  const intVal = toNumber(v);
  if (v && v.length > 0 && !Number.isNaN(intVal)) {
    return intVal;
  } else if (v === 'true') {
    return true;
  } else if (v === 'false') {
    return false;
  } else if (v === 'undefined') {
    return undefined;
  }
  return v;
};

export function decodeHtml() {
  const txt = document.createElement('textarea');
  return (html) => {
    txt.innerHTML = html;
    return txt.value;
  };
}

export function conditionalRun(cmp, prop, func) {
  const action = (typeof func === 'string') ? cmp[func] : func;
  return (newProps) => {
    if (action instanceof Function && get(newProps, prop, null) !== get(cmp.props, prop, null)) {
      action(newProps);
    }
  };
}
