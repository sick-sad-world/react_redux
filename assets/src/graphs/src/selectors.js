import createSelector from 'common/selector-creator';

const getGraphState = ({ graphs }, props) => graphs.state;

const getGraphData = ({ graphs }, props) => graphs.payload;

const getBriefDataById = ({ graphs }, props) => graphs.cache[props.id] || {};

export function makeContainerSelector() {
  const selector = createSelector(
    getGraphState,
    getGraphData,
    (state, payload) => ({ state, payload })
  );

  return (state, props) => selector(state, props);
}

export function makeBriefSelector() {
  const selector = createSelector(
    getGraphState,
    getBriefDataById,
    (state, payload) => ({
      state,
      payload: payload.data,
      timestamp: payload.timestamp
    })
  );

  return (state, props) => selector(state, props);
}
