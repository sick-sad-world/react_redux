import { mapValues } from 'lodash';
import { numOrString } from 'functions';

export function mapGraphData(data) {
  return Object.keys(data).reduce((acc, key) => {
    if (key !== '' && !data[key].found) {
      const dateValues = mapValues(data[key], numOrString);
      acc.push({
        date: key,
        ...dateValues,
        last: undefined,
        first: undefined
      });
    }
    return acc;
  }, []);
}
