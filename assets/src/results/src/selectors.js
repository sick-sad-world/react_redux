import createSelector from 'common/selector-creator';

const getResultsById = ({ results }, props) => results[props.id];

export function makeContainerSelector() {
  const selector = createSelector(getResultsById, results => ({ ...results }));
  return (state, props) => selector(state, props);
}
