import createSelector from 'common/selector-creator';
import { defaultData } from './defaults';

const getReportsState = ({ reports }) => reports.state;

const getReports = ({ reports }) => reports.payload;

const getCurrentId = ({ reports }, props) => parseInt(props.params.id, 10) || 0;

const getNewName = ({ reports }, props) => props.location.query.name;

export default function makeReportSelector() {
  return createSelector(
    getReportsState,
    getReports,
    getCurrentId,
    getNewName,
    (state, payload, curId, newName) => ({
      state,
      curId,
      payload: payload.map(({ id, name }) => ({ id, name })),
      chosen: (name) ? { ...defaultData, name: newName, order: payload.length } : payload.find(({ id }) => id === curId)
    }));
}
