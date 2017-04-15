import types from '../types';
import { defColumnData, defDisplaySettings } from '../defaults';

export const composeColumnData = (column) => {
  if (!Object.keys(column.data).length) {
    column.data = { ...defColumnData, ...column.data };
  }
  if (!column.display_settings) {
    column.display_settings = defDisplaySettings;
  } else if (typeof column.display_settings === 'string') {
    column.display_settings = column.display_settings.split(',');
  }
  delete column.ID;
};

export default ({ dispatch, getState }) => next => (action) => {
  if (action.type === types.READ) {
    action.payload.forEach(composeColumnData);
  } else if (action.type === types.CREATE) {
    composeColumnData(action.payload);
  }

  return next(action);
};
