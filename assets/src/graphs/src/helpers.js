import { mapValues, assign } from 'lodash';
import { numOrString } from 'functions';
import { movWindow, limit } from './defaults';

export function typeMapper(types) {
  return types.reduce((acc, type) => {
    acc[type] = 0;
    acc[`${type}_rate`] = 0;
    acc[`${type}_avg`] = 0;
    acc[`${type}_mov_avg`] = 0;
    acc[`${type}_change`] = 0;
    return acc;
  }, { first: undefined, last: undefined });
}

export function createTypeHash(types, val) {
  return types.reduce((acc, type) => {
    acc[type] = val;
    return acc;
  }, {});
}

export function averageCounter(types) {
  const cache = createTypeHash(types, 0);
  const sum = createTypeHash(types, 1);
  return (type, value = 0) => {
    sum[type] += value;
    cache[type] += 1;
    return Math.round(sum[type] / cache[type]);
  };
}

export function movingAverageCounter(types) {
  const cache = createTypeHash(types, []);
  return (type, value = 0) => {
    cache[type].push(value);
    if (cache[type].length > movWindow) {
      cache[type].shift();
    }

    const movingsum = cache[type].reduce((mVsum, val) => {
      mVsum += val;
      return mVsum;
    }, 0);

    return Math.round(movingsum / cache[type].length);
  };
}

export function mapGraphData(data, types) {
  const lastCache = typeMapper(types);

  const avgCounter = averageCounter(types);
  const movAverage = movingAverageCounter(types);

  let dateTimes = Object.keys(data).filter(key => key !== '').sort();
  dateTimes = dateTimes.slice(Math.max(dateTimes.length - limit, 0));

  return dateTimes.map((dateTime, i) => {
    const { found, ...measurement } = mapValues(data[dateTime], numOrString);

    const result = types.reduce((acc, type) => {
      const rate = measurement[`rate_${type}`] || lastCache[`${type}_rate`];
      acc[type] = measurement[type] || lastCache[type];
      acc[`${type}_rate`] = rate;

      acc[`${type}_avg`] = avgCounter(type, rate);
      acc[`${type}_mov_avg`] = movAverage(type, rate);
      acc[`${type}_change`] = (i > 0) ? (rate - lastCache[`${type}_rate`]) || 0 : 0;

      return acc;
    }, { date: dateTime, found });

    assign(lastCache, result);
    return result;
  });
}
