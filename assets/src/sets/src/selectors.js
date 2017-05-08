import { includes } from 'lodash';
import createSelector from 'common/selector-creator';

const getSetsState = ({ sets }) => sets.state;

const getSets = ({ sets }) => sets.payload;

const getCurrentId = ({ sets }, props) => parseInt(props.params.id, 10) || 0;

const getCriterea = ({ sets }, props) => props.criterea;

export function makeContainerSelector() {
  return createSelector(
    getSetsState,
    getSets,
    getCurrentId,
    (state, payload, curId) => ({
      state,
      curId,
      payload: payload.map(({ id, name, source_ids }) => ({ id, name, source_ids, counter: source_ids.length })),
      chosen: payload.find(({ id }) => id === curId)
    }));
}

export function makeListSelector() {
  return createSelector(
    getSetsState,
    getSets,
    getCriterea,
    (state, payload, criterea) => {
      let result = payload;

      if (criterea) {
        if (criterea.set_ids) {
          result = payload.filter(set => includes(criterea.set_ids, set.id));
        } else if (criterea.search) {
          const search = new RegExp(criterea.search, 'i');
          result = payload.filter(set => search.test(set.name));
        } else {
          result = [...payload];
        }
      }
      return {
        state,
        payload: result
      };
    }
  );
}
