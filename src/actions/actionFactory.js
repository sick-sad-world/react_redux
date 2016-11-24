import * as ACTIONS from './types';
import fetch from '../fetch';
import { setAppState } from './util';

export default function createAction (url, ACTION) {

  if (typeof url !== 'string' && !url && !url.length) {
    throw new Error('Please provide url for backend endpoint.');
  }

  return (data, silent) => (dispatch) => {

    if (typeof data === 'boolean') {
      silent = data;
      data = undefined;
    }

    !silent && dispatch(setAppState(3));
    return fetch(url, data).then(payload => {
      let action = {type: ACTION, payload, silent};
      !silent && dispatch(setAppState(2));
      dispatch(action);
      return action;
    });

  }
}

export const readData = (type) => createAction(type, ACTIONS[`GET_${type.toUpperCase()}`]);
export const createData = (type) => createAction(`add_${type}`, ACTIONS[`CREATE_${type.toUpperCase()}`]);
export const updateData = (type) => createAction(type, ACTIONS[`UPDATE_${type.toUpperCase()}`]);
export const deleteData = (type) => createAction(`remove_${type}`, ACTIONS[`DELETE_${type.toUpperCase()}`]);