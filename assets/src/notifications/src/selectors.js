import createSelector from 'common/selector-creator';
import { includes } from 'lodash';

const getNotifications = ({ notifications }) => notifications;

export function makeContainerSelector() {
  const selector = createSelector(
    getNotifications,
    notifications => ({
      notifications
    })
  );

  return (state, props) => selector(state, props);
}
