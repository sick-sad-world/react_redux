import { has } from 'lodash';

import { updateObjectById } from 'common/reducer-factory';
import { LOGIN, LOGOUT } from 'common/type-factory';

import types from './types';
import { types as columns } from 'src/columns';

export default (state = {}, action) => {
  switch (action.type) {
    case LOGOUT:
    case LOGIN:
      return {};
    case types.STATE:
      return updateObjectById(state, action.entity, prevState => ({
        payload: (prevState) ? prevState.payload : [],
        state: (has(action, 'state')) ? action.state : 2
      }));
    case types.READ:
      return updateObjectById(state, action.entity, () => ({
        payload: action.payload,
        state: 2
      }));
    case types.UPDATE:
      return updateObjectById(state, action.entity, prevState => ({
        payload: prevState.payload.map(link => (link.hash === action.payload.hash ? action.payload : link)),
        state: 2
      }));
    case types.PUSH:
      return updateObjectById(state, action.entity, prevState => ({
        payload: [...prevState.payload, ...action.payload],
        state: 2
      }));
    case types.FAVORITE:
      return updateObjectById(state, action.entity, prevState => ({
        payload: prevState.payload.map((link) => {
          if (link.hash === action.payload.hash) {
            return { ...link, favorite: (action.payload.unfavorite) ? 0 : 1 };
          }
          return link;
        }),
        state: 2
      }));
    case types.IGNORE:
      return updateObjectById(state, action.entity, prevState => ({
        payload: prevState.payload.map((link) => {
          if (link.hash === action.payload.hash) {
            return { ...link, ignore: (action.payload.unignore) ? 0 : 1 };
          }
          return link;
        }),
        state: 2
      }));
    case columns.DELETE:
      return { ...state, [action.payload.id]: undefined };
    default:
      return state;
  }
};