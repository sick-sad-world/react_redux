export const inject = (target, mixin) => {
  for (let key in mixin) {
    if (key !== '_inject' && !(target[key] instanceof Function)) {
      target[key] = mixin[key].bind(target);
    }
  } 
}

export const numOrString = (str, base = 10) => {
  let int = parseFloat(str, base);
  return (int !== int) ? str : int; 
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

export const sortParamToShort = (stat = '') => {
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