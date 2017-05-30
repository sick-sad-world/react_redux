import { mapValues } from 'lodash';
import { numOrString } from 'functions';
import { movWindow } from './defaults';

export function typeMapper(types) {
  return types.reduce((acc, type) => {
    acc[type] = 0;
    acc[`${type}_rate`] = 0;
    acc[`${type}_avg`] = 0;
    acc[`${type}_mov_avg`] = 0;
    acc[`${type}_change`] = 0;
    return acc;
  }, {});
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
  const typemap = typeMapper(types);
  const avgCounter = averageCounter(types);
  const movAverage = movingAverageCounter(types);

  return Object.keys(data).filter(key => key !== '').sort().map((measurement, i, datemap) => {
    const result = mapValues(data[measurement], numOrString);

    return types.reduce((acc, type) => {
      const rate = `rate_${type}`;
      acc[type] = result[type] || 0;
      acc[`${type}_rate`] = result[rate] || 0;

      acc[`${type}_avg`] = avgCounter(type, result[rate]);
      acc[`${type}_mov_avg`] = movAverage(type, result[rate]);
      acc[`${type}_change`] = (i > 0) ? (result[rate] - data[datemap[i - 1]][rate]) || 0 : 0;

      return acc;
    }, { date: measurement, ...typemap });
  });
}
