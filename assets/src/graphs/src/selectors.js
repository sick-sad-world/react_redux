import createSelector from 'common/selector-creator';

const getGraphState = ({ graphs }, props) => graphs.state;

const getGraphData = ({ graphs }, props) => graphs.payload;

const getGraphConfig = ({ graphs }, props) => graphs.config;

export function makeContainerSelector() {
  const selector = createSelector(
    getGraphState,
    getGraphData,
    getGraphConfig,
    (state, payload, config) => ({ state, payload, config })
  );

  return (state, props) => selector(state, props);
}
