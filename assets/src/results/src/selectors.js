import createSelector from 'common/selector-creator';
import { defaultResults } from './defaults';

const getResultsById = ({ results }, props) => results[props.id] || { ...defaultResults };

const getSortParam = ({ results }, props) => props.sort;

export function makeContainerSelector() {
  const selector = createSelector(
    getResultsById,
    getSortParam,
    ({ state, payload }, sort) => ({
      state,
      payload: payload.map(({ hash, title, image, url, domain, found, author, ...rest }) => ({ hash, title, image, url, domain, found, author, [sort]: rest[sort] }))
    })
  );
  return (state, props) => selector(state, props);
}
