import { GET_COLUMNS, ADD_COLUMN, EDIT_COLUMN } from '../helpers/types';
import { defColumnData, defDisplaySettings } from '../redux/columns';

export const composeColumnData = (column) => {
  if (!Object.keys(column.data).length) {
    column.data = {...defColumnData, ...column.data};
  }
  if (!column.display_settings) {
    column.display_settings = defDisplaySettings;
  } else if (typeof column.display_settings === 'string') {
    column.display_settings = column.display_settings.split(',');
  }
  delete column.ID;
}

export default ({dispatch, getState}) => (next) => (action) => {

  if (action.type === GET_COLUMNS) {
    action.payload.forEach(composeColumnData);
  } else if (action.type === ADD_COLUMN || action.type === EDIT_COLUMN) {
    composeColumnData(action.payload);
  }

  return next(action);
}