import { GET_COLUMNS, ADD_COLUMN, EDIT_COLUMN } from '../helpers/types';
import { defaultsDeep } from 'lodash';
import { defColumn } from '../redux/columns';

export const composeColumnData = (column) => {
  let result = defaultsDeep(column, defColumn);
  if (!result.display_settings) {
    result.display_settings = defColumn.display_settings;
  } else if (typeof result.display_settings === 'string') {
    result.display_settings = result.display_settings.split(',');
  }
  return result;
}

export default ({dispatch, getState}) => (next) => (action) => {

  if (action.type === GET_COLUMNS) {
    action.payload.forEach(composeColumnData);
  } else if (action.type === ADD_COLUMN || action.type === EDIT_COLUMN) {
    composeColumnData(action.payload);
  }

  return next(action);
}