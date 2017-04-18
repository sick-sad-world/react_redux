import createSelector from 'common/selector-creator';
import defaultAlert from './defaults';

const getAlertsState = ({ alerts }) => alerts.state;

const getAlerts = ({ alerts }) => alerts.payload;

const getCurrentId = ({ alerts }, props) => parseInt(props.params.id, 10) || 0;

const getNewName = ({ alerts }, props) => props.location.query.name;

export default () => createSelector(
  getAlertsState,
  getAlerts,
  getCurrentId,
  getNewName,
  (state, payload, curId, newName) => ({
    state,
    curId,
    payload: payload.map(({ id, name }) => ({ id, name })),
    chosen: (name) ? { ...defaultAlert, name: newName, order: payload.length } : payload.find(({ id }) => id === curId)
  }));
