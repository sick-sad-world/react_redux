import createSelector from 'common/selector-factory';
import { defaultData } from './defaults';

const getReports = ({ reports }) => reports;

const getCurrentId = ({ reports }, props) => parseInt(props.params.id, 10) || 0;

const getNewName = ({ reports }, props) => props.location.query.name;

const getDefEmail = ({ user }) => user.email;

export function makeContainerSelector() {
  return createSelector(
    getReports,
    getCurrentId,
    getNewName,
    getDefEmail,
    (payload, curId, newName, defEmail) => ({
      curId,
      payload: payload.map(({ id, name, columns, active }) => ({ id, name, counter: columns.length, active })),
      chosen: (newName) ? { ...defaultData, name: newName, recipient: defEmail } : payload.find(({ id }) => id === curId)
    }));
}
