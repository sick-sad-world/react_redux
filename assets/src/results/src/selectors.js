import createSelector from 'common/selector-creator';
import { defaultResults } from './defaults';

const getResultsById = ({ results }, props) => results[props.id] || { ...defaultResults };

const getSortParam = ({ results }, props) => props.sort;

const getFavoriteValue = ({ results }, props) => props.data.show_favorites;

const getIgnoredValue = ({ results }, props) => props.data.show_ignored;

export function makeContainerSelector() {
  const selector = createSelector(
    getResultsById,
    getSortParam,
    getFavoriteValue,
    getIgnoredValue,
    ({ state, payload, error }, sort, fav, ign) => {
      let results = payload.filter(({ ignore }) => !ignore);
      if (fav === 1) {
        results = payload.filter(({ favorite }) => !!favorite);
      } else if (ign === 1) {
        results = payload;
      }

      return {
        state,
        payload: results.map(({ hash, title, image, url, domain, description, found, author, favorite, ignore, ...rest }) => ({
          hash, title, image, url, domain, description, found, author, favorite, ignore, [sort]: rest[sort]
        })),
        error
      };
    }
  );
  return (state, props) => selector(state, props);
}
