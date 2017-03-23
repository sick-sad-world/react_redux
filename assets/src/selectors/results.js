import createSelector from '../helpers/selectorCreator';

const getResultsById = ({results}, props) => results[props.id];

export const makeResultsSelector = () => createSelector(getResultsById, (results) => ({...results}));