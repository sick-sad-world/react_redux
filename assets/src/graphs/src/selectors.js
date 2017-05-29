import createSelector from 'common/selector-creator';

const getGraphState = ({ graphs }, props) => graphs.state;

const getGraphData = ({ graphs }, props) => graphs.payload;

export function makeContainerSelector() {
  const selector = createSelector(
    getGraphState,
    getGraphData,
    (state, payload) => ({ state, payload })
  );

  return (state, props) => selector(state, props);
}
