import createSelector from 'common/selector-creator';
import { includes } from 'lodash';

const getColumnState = ({ columns }) => columns.state;

const getColumns = ({ columns }) => columns.payload;

const getCurrentId = ({ columns }, props) => parseInt(props.params.id, 10) || 0;

const getCriterea = ({ columns }, props) => props.criterea;

const getColumnIds = ({ columns }, props) => props.column_ids || [];

export function makeContainerSelector() {
  return createSelector(
    getColumnState,
    getColumns,
    getCurrentId,
    (state, payload, curId) => ({
      state,
      curId,
      payload: payload.map(({ id, name, open, order }) => ({ id, name, open, order })),
      chosen: payload.find(({ id }) => id === curId)
    }));
}

export function makeDashboardSelector() {
  return createSelector(
    getColumns,
    getColumnIds,
    (payload, column_ids) => ({
      payload: payload.filter(({ id, open }) => open && includes(column_ids, id))
    }));
}

export function makeDropdownSelector() {
  return createSelector(
    getColumns,
    columns => columns.map(({ id, name }) => ({
      value: id,
      label: name
    })));
}
