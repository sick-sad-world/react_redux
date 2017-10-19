import { includes } from 'lodash';
import createSelector, { getCriterea, composeCriterea } from 'common/selector-factory';

const getFeeds = ({ feeds }) => feeds;

export function makeContainerSelector() {
  const selector = createSelector(
    getFeeds,
    getCriterea(),
    (payload, { uniq_ids, disabled, ...criterea }) => ({
        payload: composeCriterea(criterea)(payload).map(feed => ({
          ...feed,
          deletable: (uniq_ids) && includes(uniq_ids, feed.id),
          disabled: (disabled) && includes(disabled, feed.id)
        }))
      })
  );

  return (state, props) => selector(state, props);
}
