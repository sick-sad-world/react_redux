import createSelector from 'common/selector-factory';
import { defaultData } from './defaults';

const getAlerts = ({ alerts }) => alerts;

const getCurrentId = ({ alerts }, props) => parseInt(props.params.id, 10) || 0;

const getNewName = ({ alerts }, props) => props.location.query.name;

const getDefEmail = ({ user }) => user.email;

export function makeContainerSelector() {
  const selector = createSelector(
    getAlerts,
    getCurrentId,
    getNewName,
    getDefEmail,
    (payload, curId, newName, defEmail) => ({
      curId,
      payload: payload.map(({ id, name, columns, active }) => ({ id, name, counter: columns.length, active })),
      chosen: (newName) ? { ...defaultData, name: newName, recipient: defEmail } : payload.find(({ id }) => id === curId)
    })
  );

  return (state, props) => selector(state, props);
}
