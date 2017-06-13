import { mapValues, unescape } from 'lodash';
import { tableStatsRegExp } from 'src/display-settings';

export function splitText(result) {
  const limit = 128;
  const index = {
    max: Math.round(limit * 1.25),
    min: Math.round(limit * 0.75),
    curr: -1,
    isValid() {
      return this.curr >= 0 && (this.curr <= this.max || this.curr >= this.min);
    }
  };

  if ((typeof result.description === 'string') && result.description.length > Math.round(limit * 1.75)) {
    index.curr = result.description.search(/[\.\?\!]\s/);
    if (!index.isValid()) {
      index.curr = result.description.indexOf(' ', limit);
      if (!index.isValid()) {
        index.curr = limit;
      }
    } else {
      index.curr += 2;
    }
  }

  return {
    ...result,
    title: unescape(result.title),
    additional: (index.curr >= 0) ? unescape(result.description.substring(index.curr, result.description.length)) : '',
    description: unescape((index.curr >= 0) ? result.description.substring(0, index.curr) : result.description)
  };
}

export const formatNumber = (num, gap = 1) => {
  if (typeof num !== 'number') {
    return false;
  } else if (num < 1000) {
    return `${num}`;
  } else if (num >= 1000 && num < 1000000) {
    return `${(num / 1000).toFixed(gap)}K`;
  } else if (num >= 1000000 && num < 1000000000) {
    return `${(num / 1000000).toFixed(gap)}M`;
  } else if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(gap)}B`;
  }
  return num;
};

export const sortParamToShort = (stat = '') => {
  let result = stat.replace('_views', '');
  if (stat.indexOf('rate_') === 0) {
    result = `${stat.replace('rate_', '')}/hr`;
  } else if (stat.indexOf('maxrate_') === 0) {
    result = `${stat.replace('maxrate_', 'max ')}/hr`;
  } else if (stat.indexOf('hotness_') === 0) {
    result = stat.replace('hotness_', 'hot ');
  }
  return result;
};

export const numerizeData = result => mapValues(result, (v, k) => {
  if (tableStatsRegExp.test(k)) {
    const numV = parseFloat(v, 10);
    return (!isNaN(numV)) ? numV : v;
  }
  return v;
});
