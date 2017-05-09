import { includes } from 'lodash';
import createSelector from 'common/selector-creator';

const getSetsState = ({ sets }) => sets.state;

const getSets = ({ sets }) => sets.payload;

const getCurrentId = ({ sets }, props) => parseInt(props.params.id, 10) || 0;

const getCriterea = ({ sets }, props) => props.criterea;

const getDisabled = ({ sets }, props) => props.disabled_sets;

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

export function makeFullListSelector() {
  return createSelector(
    getSetsState,
    getSets,
    getDisabled,
    (state, payload, disabled) => ({
      state,
      payload: (disabled && disabled.length) ? payload.map(set => ({
        ...set,
        disabled: (disabled) && includes(disabled, set.id)
      })) : payload
    })
  );
}

export function makeListSelector() {
  return createSelector(
    getSetsState,
    getSets,
    getCriterea,
    (state, payload, criterea) => {
      let result = [];

      if (criterea) {
        if (criterea.set_ids) {
          result = payload.filter(set => includes(criterea.set_ids, set.id));
        } else if (criterea.search) {
          const search = new RegExp(criterea.search, 'i');
          result = payload.filter(set => search.test(set.name));
        }
      }

      return {
        state,
        payload: (criterea) ? result.map(set => ({
          ...set,
          disabled: (criterea.disabled) && includes(criterea.disabled, set.id)
        })) : payload
      };
    }
  );
}
