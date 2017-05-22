import createSelector from 'common/selector-creator';
import { defaultResults } from './defaults';

const getResultsById = ({ results }, props) => results[props.id] || { ...defaultResults };

const getSortParam = ({ results }, props) => props.sort;

export function makeContainerSelector() {
  const selector = createSelector(
    getResultsById,
    getSortParam,
    ({ state, payload, error }, sort) => ({
      state,
      payload: payload.map(({ hash, title, image, url, domain, description, found, author, ...rest }) => ({ hash, title, image, url, domain, description, found, author, [sort]: rest[sort] })),
      error
    })
  );
  return (state, props) => selector(state, props);
}
