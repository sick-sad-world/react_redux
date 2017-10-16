import { includes } from 'lodash';
import createSelector from 'common/selector-factory';

const getSets = ({ sets }) => sets;

const getCurrentId = ({ sets }, props) => parseInt(props.params.id, 10) || 0;

const getCriterea = ({ sets }, props) => props.criterea;

const getDisabled = ({ sets }, props) => props.disabled_sets;

export function makeContainerSelector() {
  const selector = createSelector(
    getSets,
    getCurrentId,
    (payload, curId) => ({
      curId,
      payload: payload.map(({ id, name, source_ids }) => ({ id, name, source_ids, counter: source_ids.length })),
      chosen: payload.find(({ id }) => id === curId)
    })
  );

  return (state, props) => selector(state, props);
}

export function makeFullListSelector() {
  const selector = createSelector(
    getSets,
    getDisabled,
    (payload, disabled) => ({
      payload: (disabled && disabled.length) ? payload.map(set => ({
        ...set,
        disabled: (disabled) && includes(disabled, set.id)
      })) : payload
    })
  );

  return (state, props) => selector(state, props);
}

export function makeListSelector() {
  const selector = createSelector(
    getSets,
    getCriterea,
    (payload, criterea) => {
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
        payload: (criterea) ? result.map(set => ({
          ...set,
          disabled: (criterea.disabled) && includes(criterea.disabled, set.id)
        })) : payload
      };
    }
  );

  return (state, props) => selector(state, props);
}
