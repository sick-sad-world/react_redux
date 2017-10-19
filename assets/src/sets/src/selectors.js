import { includes } from 'lodash';
import createSelector, { getCriterea, composeCriterea } from 'common/selector-factory';

const getSets = ({ sets }) => sets;

const getCurrentId = ({ sets }, props) => parseInt(props.params.id, 10) || 0;

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

export function makeListSelector() {
  const selector = createSelector(
    getSets,
    getCriterea(),
    (payload, { disabled, ...criterea }) => ({
      payload: composeCriterea(criterea)(payload).map(set => ({
        ...set,
        counter: set.source_ids.length,
        disabled: (disabled) && includes(disabled, set.id)
      }))
    })
  );

  return (state, props) => selector(state, props);
}
