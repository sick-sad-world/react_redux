import createSelector from 'common/selector-factory';
import { defaultResults } from './defaults';

const getResultsById = ({ results }, props) => results[props.id] || { ...defaultResults };

const getHash = ({ results }, props) => props.hash;

const getFavoriteValue = ({ results }, props) => props.data.show_favorites;

const getIgnoredValue = ({ results }, props) => props.data.show_ignored;

export function makeContainerSelector() {
  const selector = createSelector(
    getResultsById,
    getFavoriteValue,
    getIgnoredValue,
    ({ payload, state, error }, fav, ign) => {
      let results = payload.filter(({ ignore }) => !ignore);
      if (fav === 1) {
        results = payload.filter(({ favorite }) => !!favorite);
      } else if (ign === 1) {
        results = payload;
      }

      return {
        state,
        payload: results,
        error
      };
    }
  );
  return (state, props) => selector(state, props);
}

export function makeResultSelector() {
  const selector = createSelector(
    getResultsById,
    getHash,
    ({ payload }, hashId) => {
      const result = payload.find(({ hash }) => hashId === hash);
      return {
        title: result ? result.title : 'Result not found',
        payload: result
      };
    }
  );

  return (state, props) => selector(state, props);
}
