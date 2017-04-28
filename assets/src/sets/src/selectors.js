import createSelector from 'common/selector-creator';

const getSetsState = ({ sets }) => sets.state;

const getSets = ({ sets }) => sets.payload;

const getCurrentId = ({ sets }, props) => parseInt(props.params.id, 10) || 0;

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
