import { getColumns } from 'src/columns/actions';
import { getSets } from 'src/sets/actions';
import { getSources } from 'src/feeds/actions';
import { getAlerts } from 'src/alerts/actions';
import { getReports } from 'src/reports/actions';

export default (opts) => {
  const options = {
    ...opts,
    state: false,
    notification: false
  };

  return dispatch => Promise.all([
    dispatch(getColumns({ data: 1 }, options)),
    dispatch(getSets(null, options)),
    dispatch(getSources(null, options)),
    dispatch(getAlerts(null, options)),
    dispatch(getReports(null, options))
  ]);
};
