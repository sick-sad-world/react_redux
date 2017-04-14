import createSelector from 'common/selector-creator';
import defaultReport from './defaults';

const getReportsState = ({ reports }) => reports.state;

const getReports = ({ reports }) => reports.payload;

const getCurrentId = ({ reports }, props) => parseInt(props.params.id, 10) || 0;

const getNewName = ({ reports }, props) => props.location.query.name;

export default createSelector(
  getReportsState,
  getReports,
  getCurrentId,
  getNewName,
  (state, payload, curId, newName) => ({
    state,
    curId,
    payload: payload.map(({ id, name }) => ({ id, name })),
    chosen: (name) ? { ...defaultReport, name: newName, order: payload.length } : payload.find(({ id }) => id === curId)
  }));
