import { includes } from 'lodash';
import { LOGIN, LOGOUT } from 'common/type-factory';
import { createNamespace, createReducer } from 'common/service';
import { defaultData } from './defaults';
import createAction from 'common/action-factory';


const types = createNamespace('user', 'read', 'create', 'update', 'login', 'logout');

const mergeData = (state, payload) => ({
  ...state,
  ...payload,
  image: defaultData.image
});

export default createReducer({
  [types.read]: mergeData,
  [types.create]: mergeData,
  [types.update]: mergeData,
  [LOGOUT]: 'reset'
}, defaultData);

export const actions = {
  login: createAction({
    action: LOGIN,
    call: 'login'
  }),
  logout: createAction({
    action: LOGOUT,
    call: 'logout'
  }),
  addUser: createAction({
    action: types.create,
    call: 'add_user'
  }),
  getUser: createAction({
    action: types.read,
    call: 'user'
  }),
  editUser: createAction({
    action: types.update,
    call: 'user'
  })
};

export const middlewares = {
  fixMissingEmailBcc(dataPicker, prop, modifyAction) {
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
};
