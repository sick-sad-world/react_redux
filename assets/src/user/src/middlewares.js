import { includes } from 'lodash';
import types from './types';

export function fixMissingEmailBcc(dataPicker, prop, modifyAction) {
  return ({ dispatch, getState }) => next => (action) => {
    if (action.type === types.UPDATE) {
      const { email, email_bcc } = action.payload;
      dataPicker(getState())
        .filter(data => !includes(email_bcc, data[prop]) && data[prop] !== email)
        .map(({ id, ...data }) => dispatch(modifyAction({ id, [prop]: email })));
      return next(action);
    }
    return next(action);
  };
}
