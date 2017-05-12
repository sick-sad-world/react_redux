import createSelector from 'common/selector-creator';
import { includes } from 'lodash';

const getColumnState = ({ columns }) => columns.state;

const getColumns = ({ columns }) => columns.payload;

const getCurrentId = ({ columns }, props) => parseInt(props.params.id, 10) || 0;

const getCriterea = ({ columns }, props) => props.criterea;

export function makeContainerSelector() {
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
}

export function makeListSelector() {
  return createSelector(
    getColumnState,
    getColumns,
    getCriterea,
    (state, payload, criterea) => {
      let result = [...payload];

      if (criterea) {
        result = payload.filter((column) => {
          let success = false;
          if (criterea.column_ids) {
            if (includes(criterea.column_ids, column.id)) {
              success = true;
            } else {
              success = false;
            }
          }
          if (criterea.search) {
            if (includes(criterea.search, column.name)) {
              success = true;
            } else {
              success = false;
            }
          }
          if (criterea.open) {
            success = criterea.open === column.open;
          }
          return success;
        }).map(set => ({
          ...set,
          disabled: (criterea.disabled) && includes(criterea.disabled, set.id)
        }));
      }

      return {
        state,
        payload: result
      };
    });
}

export function makeDropdownSelector() {
  return createSelector(
    getColumns,
    columns => columns.map(({ id, name }) => ({
      value: id,
      label: name
    })));
}
