import createSelector from '../helpers/selectorCreator';
import { defaultAlert } from '../redux/alerts';

const getAlertsState = ({alerts}) => alerts.state;

const getAlerts= ({alerts}) => alerts.payload;

const getCurrentId = ({alerts}, props) => parseInt(props.params.id) || 0;

const getNewName = ({alerts}, props) => props.location.query.name;

export const makeContainerSelector = () => createSelector(
  getAlertsState,
  getAlerts,
  getCurrentId,
  getNewName,
  (state, payload, curId, name) => ({
    state,
    curId,
    payload: payload.map(({id, name}) => ({id, name})),
    chosen: (name) ? { ...defaultAlert, name, order: payload.length } : payload.find(({id}) => id === curId)
  }));