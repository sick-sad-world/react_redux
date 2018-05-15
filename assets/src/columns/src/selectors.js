import createSelector from 'common/selector-factory';
import includes from 'lodash/includes';

const checkOpen = val => ({ open }) => open === val;

const checkIds = ids => ({ id }) => includes(ids, id);

const getColumns = ({ columns }) => columns;

const getColumnById = ({ columns }, { col_id }) => columns.find(({ id }) => id === col_id);

const getCurrentId = ({ columns }, props) => parseInt(props.params.id, 10) || 0;

const getColumnIds = ({ columns }, props) => props.column_ids || [];

const getOpen = ({ columns }, props) => props.open;

export function makePageSelector() {
  const selector = createSelector(
    getColumns,
    getCurrentId,
    (payload, curId) => ({
      curId,
      payload: payload.map(({ id, name, open, order, data }) => ({ id, name, open, order, data })),
      chosen: payload.find(({ id }) => id === curId)
    })
  );

  return (state, props) => selector(state, props);
}

export function makeContainerSelector() {
  const selector = createSelector(
    getColumns,
    getColumnIds,
    getOpen,
    (payload, ids, open) => {
      const criterea = [];
      if (open !== undefined) criterea.push(checkOpen(open));
      if (ids.length) criterea.push(checkIds(ids));
      return {
        payload: (criterea.length) ? payload.filter(column => criterea.every(f => f(column))) : payload
      };
    }
  );

  return (state, props) => selector(state, props);
}

export function makeSingleSelector() {
  const selector = createSelector(
    getColumnById,
    payload => ({ payload })
  );

  return (state, props) => selector(state, props);
}
