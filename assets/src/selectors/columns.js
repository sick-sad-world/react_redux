import { createSelectorCreator, defaultMemoize } from 'reselect';
import { isEqual } from 'lodash';
import { defDisplaySettings, defDashboardData } from '../redux/columns';

const createSelector = createSelectorCreator(defaultMemoize, isEqual);

const getColumnState = ({columns}) => columns.state;

const getColumns= ({columns}) => columns.payload;

const getCurrentId = ({columns}, props) => parseInt(props.params.id) || 0;

export const makeContainerSelector = () => createSelector(
  getColumnState,
  getColumns,
  getCurrentId,
  (state, payload, curId) => ({
    state,
    curId,
    payload: payload.map(({id, name, open}) => ({id, name, open})),
    chosen: payload.find(({id}) => id === curId)
  }));

export const makeDashboardSelector = () => createSelector(
  getColumnState,
  getColumns,
  (state, payload) => ({
    state,
    payload: payload.filter(({open}) => !!open)
  }));