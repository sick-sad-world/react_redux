import { includes } from 'lodash';
import createSelector from 'common/selector-factory';

const getFeeds = ({ feeds }) => feeds;

const getCriterea = ({ feeds }, props) => props.criterea;

export function makeContainerSelector() {
  const selector = createSelector(
    getFeeds,
    getCriterea,
    (payload, criterea) => {
      let result = [];

      if (criterea) {
        if (criterea.source_ids) {
          result = payload.filter(feed => includes(criterea.source_ids, feed.id));
        } else if (criterea.search) {
          const search = new RegExp(criterea.search, 'i');
          result = payload.filter(feed => search.test(feed.name));
        }
      }

      return {
        payload: (criterea) ? result.map(feed => ({
          ...feed,
          deletable: (criterea.uniq_ids) && includes(criterea.uniq_ids, feed.id),
          disabled: (criterea.disabled) && includes(criterea.disabled, feed.id)
        })) : payload
      };
    });

  return (state, props) => selector(state, props);
}
