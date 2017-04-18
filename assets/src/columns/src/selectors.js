import createSelector from 'common/selector-creator';

const getColumnState = ({ columns }) => columns.state;

const getColumns = ({ columns }) => columns.payload;

const getCurrentId = ({ columns }, props) => parseInt(props.params.id, 10) || 0;

export const makeContainerSelector = function makeContainerSelector() {
  return createSelector(
    getColumnState,
    getColumns,
    getCurrentId,
    (state, payload, curId) => ({
      state,
      curId,
      payload: payload.map(({ id, name, open }) => ({ id, name, open })),
      chosen: payload.find(({ id }) => id === curId)
    }));
};

export const makeDashboardSelector = function makeDashboardSelector() {
  return createSelector(
    getColumnState,
    getColumns,
    (state, payload) => ({
      state,
      payload: payload.filter(({ open }) => !!open)
    }));
};

export const makeDropdownSelector = function makeDropdownSelector() {
  return createSelector(
    getColumns,
    columns => columns.map(({ id, name }) => ({
      value: id,
      label: name
    })));
};
