import { GET_USER, GET_ALERTS, GET_REPORTS, GET_SOURCESETS, GET_SOURCES, GET_COLUMNS } from './types';
import createAction from './actionFactory';

export const getUser = createAction('user', GET_USER);
export const getAlerts = createAction('alerts', GET_ALERTS);
export const getReports = createAction('reports', GET_REPORTS);
export const getColumns = createAction('columns', GET_COLUMNS);
export const getSources = createAction('sources', GET_SOURCES);
export const getSourcesets = createAction('sets', GET_SOURCESETS);
export const getAppData = (silent) => {
  return (dispatch) => {
    return Promise.all([
      dispatch(getAlerts(silent)),
      dispatch(getReports(silent)),
      dispatch(getColumns(silent)),
      dispatch(getSourcesets(silent)),
      dispatch(getSources(silent))
    ]);
  };
}