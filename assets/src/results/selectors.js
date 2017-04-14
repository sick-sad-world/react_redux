import createSelector from 'common/selector-creator';

const getResultsById = ({ results }, props) => results[props.id];

export default () => createSelector(getResultsById, results => ({ ...results }));
