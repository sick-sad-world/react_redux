export const numOrString = (str, base = 10) => {
  const int = parseFloat(str, base);
  return (isNaN(int)) ? str : int;
};

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

export const formatNumber = (num, gap = 1) => {
  if (typeof num !== 'number') {
    return false;
  } else if (num < 1000) {
    return `${num}`;
  } else if (num >= 1000 && num < 1000000) {
    return `${Math.round(num / 1000).toFixed(gap)}K`;
  } else if (num >= 1000000 && num < 1000000000) {
    return `${Math.round(num / 1000000).toFixed(gap)}M`;
  } else if (num >= 1000000000) {
    return `${Math.round(num / 1000000000).toFixed(gap)}B`;
  }
  return num;
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

export const normalizeValue = (v, base = 10) => {
  const intVal = parseFloat(v, base);
  if (intVal === intVal) {
    return intVal;
  } else if (v === 'true') {
    return true;
  } else if (v === 'false') {
    return false;
  } else if (v === 'undefined') {
    return undefined;
  } else if (v === '') {
    return null;
  }
  return v;
};
