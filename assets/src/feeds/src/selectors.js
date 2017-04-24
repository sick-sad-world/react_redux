import createSelector from 'common/selector-creator';

const getFeedsState = ({ feeds }) => feeds.state;

const getFeeds = ({ feeds }) => feeds.payload;

const getCriterea = ({ feeds }, props) => props.criterea;

export function makeCritereaSelector() {
  return createSelector(
    getFeedsState,
    getFeeds,
    getCriterea,
    (state, payload, criterea) => {
      let result = payload;

      if (criterea) {
        result = payload.filter((feed) => criterea.source_ids.indexOf(feed.id) > -1);
      }

      return {
        state,
        payload: result
      };
    });
}

export function makeContainerSelector() {
  return createSelector(
    getFeedsState,
    getFeeds,
    (state, payload) => ({ state, payload }));
}
