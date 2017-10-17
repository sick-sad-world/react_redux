import createSelector from 'common/selector-factory';

const getGraphData = ({ graphs }) => graphs.payload;

const getBriefDataById = ({ graphs }, props) => graphs.cache[props.id] || {};

export function makeContainerSelector() {
  const selector = createSelector(
    getGraphData,
    payload => ({ payload })
  );

  return (state, props) => selector(state, props);
}

export function makeBriefSelector() {
  const selector = createSelector(
    getBriefDataById,
    payload => ({
      payload: payload.data,
      timestamp: payload.timestamp
    })
  );

  return (state, props) => selector(state, props);
}
