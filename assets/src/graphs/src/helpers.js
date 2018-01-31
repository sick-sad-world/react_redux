import { mapValues, assign } from 'lodash';
import { numOrString } from 'functions';

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

export function movingAverageCounter(types, movWindow) {
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

export function mapGraphRaw(data, { types, opts }) {
  const lastCache = typeMapper(types);

  const avgCounter = averageCounter(types);
  const movAverage = movingAverageCounter(types, opts.movWindow);

  let dateTimes = Object.keys(data).filter(key => key !== '').sort();
  dateTimes = dateTimes.slice(Math.max(dateTimes.length - opts.limit, 0));

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

export function mapGraphGoogle(data, { types, opts }) {
  const sum = {};
  const avgCnt = {};
  const previous = {};
  const movVals = {};
  let movCnt = 0;
  let annotation;
  let annotationText;
  const dateExp = /\d{4}\/\d{2}\/\d{2}\s\d{2}:\d{2}:\d{2}/;

  // Create DataTable and make Datetimes column
  // ===========================================================================
  const result = new window.google.visualization.DataTable();
  let datetimes = Object.keys(data).filter(k => k && k.length).sort();
  result.addColumn('datetime', null);
  if (opts.limit) datetimes = datetimes.splice(-opts.limit, opts.limit);

  // Add Columns for each required Mesaurement type
  // ===========================================================================
  types.forEach((type, i) => {
    const rate = `Rate ${type}`;
    if (!opts.nocount) {
      result.addColumn('number', type);
      if (i === 0) {
        result.addColumn({ type: 'string', role: 'annotation' });
        result.addColumn({ type: 'string', role: 'annotationText' });
      }
    }
    if (!opts.norate) result.addColumn('number', rate);
    if (!opts.noaverage) result.addColumn('number', `Average ${rate}`);
    if (!opts.nomovingaverage) result.addColumn('number', `Moving average ${rate}`);
    if (!opts.nochangerate) result.addColumn('number', `Change ${rate}`);
    movVals[`rate_${type}`] = [];
  }, this);

  datetimes.filter(v => dateExp.test(v)).forEach((dt) => {
    const row = [new Date(`${dt} UTC`)];

    types.forEach((rowType, j) => {
      const rr = `rate_${rowType}`;
      const rV = parseInt(data[dt][rr]);

      if (!opts.nocount) {
        row.push(parseInt(data[dt][rowType]));
        if (j === 0) {
          row.push(annotation);
          row.push(annotationText);
        }
      }

      if (!opts.norate) row.push(rV);

      if (!opts.noaverage) {
        if (isNaN(data[dt][rr])) {
          row.push(null);
        } else {
          sum[rr] = sum[rr] ? sum[rr] + rV : rV;
          avgCnt[rr] = avgCnt[rr] ? (avgCnt[rr] + 1) : 1;
          row.push(Math.round(sum[rr] / avgCnt[rr]));
        }
      }

      if (!opts.nomovingaverage) {
        if (isNaN(data[dt][rr])) {
          row.push(null);
        } else {
          movVals[rr].push(data[dt][rr] ? data[dt][rr] : 0);
          movCnt += 1;

          if (movCnt > opts.movWindow) {
            movVals[rr].shift();
            movCnt = opts.movWindow;
          }

          row.push(Math.round(movVals[rr].reduce((acc, mv) => {
            acc += mv;
            return acc;
          }, 0) / movCnt));
        }
      }

      if (!opts.nochangerate) {
        if (isNaN(previous[rr])) previous[rr] = 0;
        if (isNaN(data[dt][rr])) {
          row.push(null);
        } else {
          row.push(rV - parseInt(previous[rr]));
          previous[rr] = data[dt][rr];
        }
      }
    });

    annotation = '';
    annotationText = '';
    if (data[dt].found) {
      annotation = data[dt].found;
      annotationText = `Found: ${new Date(`${dt} UTC`)}`;
    } else {
      result.addRow(row);
    }
  }, this);
  return result;
}
