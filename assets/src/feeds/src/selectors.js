import { includes } from 'lodash';
import createSelector from 'common/selector-creator';

const getFeedsState = ({ feeds }) => feeds.state;

const getFeeds = ({ feeds }) => feeds.payload;

const getCriterea = ({ feeds }, props) => props.criterea;

export function makeContainerSelector() {
  return createSelector(
    getFeedsState,
    getFeeds,
    getCriterea,
    (state, payload, criterea) => {
      let result = payload;

      if (criterea) {
        if (criterea.source_ids) {
          result = payload.filter(feed => includes(criterea.source_ids, feed.id));
        } else if (criterea.search) {
          const search = new RegExp(criterea.search, 'i');
          result = payload.filter(feed => search.test(feed.name));
        } else {
          result = [...payload];
        }

        if (criterea.uniq_ids) {
          result.forEach((feed) => {
            feed.deletable = includes(criterea.uniq_ids, feed.id);
          });
        }
      }

      return {
        state,
        payload: result
      };
    });
}
