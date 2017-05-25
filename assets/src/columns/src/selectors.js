import createSelector from 'common/selector-creator';
import { includes } from 'lodash';

const checkOpen = val => ({ open }) => open === val;

const checkIds = ids => ({ id }) => includes(ids, id);

const getColumnState = ({ columns }) => columns.state;

const getColumns = ({ columns }) => columns.payload;

const getCurrentId = ({ columns }, props) => parseInt(props.params.id, 10) || 0;

const getColumnIds = ({ columns }, props) => props.column_ids || [];

const getOpen = ({ columns }, props) => props.open;

export function makePageSelector() {
  const selector = createSelector(
    getColumnState,
    getColumns,
    getCurrentId,
    (state, payload, curId) => ({
      state,
      curId,
      payload: payload.map(({ id, name, open, order }) => ({ id, name, open, order })),
      chosen: payload.find(({ id }) => id === curId)
    })
  );

  return (state, props) => selector(state, props);
}

export function makeContainerSelector() {
  const selector = createSelector(
    getColumnState,
    getColumns,
    getColumnIds,
    getOpen,
    (state, payload, ids, open) => {
      const criterea = [];
      if (open !== undefined) criterea.push(checkOpen(open));
      if (ids.length) criterea.push(checkIds(ids));
      return {
        state,
        payload: (criterea.length) ? payload.filter(column => criterea.every(f => f(column))) : payload
      };
    }
  );

  return (state, props) => selector(state, props);
}
