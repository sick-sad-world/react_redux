import createSelector from '../helpers/selectorCreator';
import { defaultReport } from '../redux/reports';

const getReportsState = ({reports}) => reports.state;

const getReports= ({reports}) => reports.payload;

const getCurrentId = ({reports}, props) => parseInt(props.params.id) || 0;

const getNewName = ({reports}, props) => props.location.query.name;

export const makeContainerSelector = () => createSelector(
  getReportsState,
  getReports,
  getCurrentId,
  getNewName,
  (state, payload, curId, name) => ({
    state,
    curId,
    payload: payload.map(({id, name}) => ({id, name})),
    chosen: (name) ? { ...defaultReport, name, order: payload.length } : payload.find(({id}) => id === curId)
  }));