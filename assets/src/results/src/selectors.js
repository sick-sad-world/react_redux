import createSelector from 'common/selector-creator';

const getResultsById = ({ results }, props) => results[props.id];

export default function makeResultSelector() {
  return createSelector(getResultsById, results => ({ ...results }));
}
