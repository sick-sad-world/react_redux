import { createSelectorCreator, defaultMemoize, createStructuredSelector } from 'reselect';
import { isEqual, get, every, transform, includes } from 'lodash';

const selectorCreator = createSelectorCreator(defaultMemoize, isEqual);

export default selectorCreator;

export function commonSelector(selectors) {
  const selector = createStructuredSelector(selectors, selectorCreator);
  return () => (state, props) => selector(state, props);
}

export const getCriterea = (defaults = {}) => (state, props) => get(props, 'criterea', defaults);

export const inc = arr => ({ id }) => includes(arr, id);

export const exc = arr => ({ id }) => !includes(arr, id);

export const test = (str, prop = 'name') => {
  const search = new RegExp(str, 'i');
  return v => search.test(v[prop]);
};

const filterMap = {
  ids: inc,
  omit: exc,
  search: test
};

export function composeCriterea(criterea) {
  const filters = transform(criterea, (acc, v, k) => {
    if (v instanceof Function) {
      acc.push(v);
    } else if (filterMap[k] instanceof Function) {
      acc.push(filterMap[k](v));
    }
    return acc;
  }, []);
  return (payload) => {
    if (filters.length) {
      return payload.filter(v => every(filters, f => f(v)));
    }
    return payload;
  };
}
