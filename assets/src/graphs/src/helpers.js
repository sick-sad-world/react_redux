import { mapValues, sortBy } from 'lodash';
import { numOrString } from 'functions';

export function typeMapper(types) {
  return types.reduce((acc, type) => {
    acc[type] = 0;
    acc[`rate_${type}`] = 0;
    acc[`av_${type}`] = 0;
    acc[`mov_av_${type}`] = 0;
    acc[`change_${type}`] = 0;
    return acc;
  }, {});
}

export function mapGraphData(data, types) {
  const typemap = typeMapper(types);
  let datamap = Object.keys(data).filter(key => key !== '').sort();

  const sum = {};
  const avg_counter = types.reduce((acc, type) => {
    acc[`rate_${type}`] = [];
    return acc;
  }, {});
  const moving_values = types.reduce((acc, type) => {
    acc[`rate_${type}`] = [];
    return acc;
  }, {});
  const previous = types.reduce((acc, type) => {
    acc[`rate_${type}`] = [];
    return acc;
  }, {});
  let movingcount = 0;
  const movWindow = 24;

  datamap = datamap.map(key => ({ date: key, ...typemap }));

  datamap = datamap.map((measurement) => {
    const result = { ...typemap, ...mapValues(data[measurement.date], numOrString) };

    return types.reduce((acc, type) => {
      const rate = `rate_${type}`;
      acc[type] = result[type];
      acc[rate] = result[rate];

      sum[rate] = sum[rate] ? (sum[rate] + result[rate]) : result[rate];
      avg_counter[rate] = avg_counter[rate] ? (avg_counter[rate] + 1) : 1;
      acc[`av_${type}`] = Math.round(sum[rate] / avg_counter[rate]);

      moving_values[rate].push(result[rate] ? result[rate] : 0);
      movingcount += 1;

      if (movingcount > movWindow) {
        moving_values[rate].shift();
        movingcount = movWindow;
      }

      const movingsum = moving_values[rate].reduce((mVsum, val) => {
        mVsum += val;
        return mVsum;
      }, 0);

      acc[`mov_av_${type}`] = Math.round(movingsum / movingcount);

      acc[`change_${type}`] = result[rate] - previous[rate];
      previous[rate] = result[rate];

      return acc;
    }, { ...measurement });
  });

  return datamap;
}
