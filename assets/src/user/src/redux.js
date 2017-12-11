import { includes } from 'lodash';
import createTypes, { LOGIN, LOGOUT } from 'common/type-factory';
import { defaultData } from './defaults';
import createAction from 'common/action-factory';


export const types = createTypes('user');

export default (state = { ...defaultData }, action) => {
  switch (action.type) {
    case types.CREATE:
    case types.READ:
    case types.UPDATE:
      return {
        ...state.payload,
        ...action.payload,
        image: defaultData.image
      };
    case LOGOUT:
      return { ...defaultData };
    default:
      return state;
  }
};

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
    action: types.CREATE,
    call: 'add_user'
  }),
  getUser: createAction({
    action: types.READ,
    call: 'user'
  }),
  editUser: createAction({
    action: types.UPDATE,
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
