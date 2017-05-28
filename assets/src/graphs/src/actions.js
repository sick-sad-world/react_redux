import createAction from 'common/action-factory';
import types from './types';

export const getResultMeasurements = createAction({
  type: types.READ,
  state_type: types.STATE,
  url: 'measurements'
});
