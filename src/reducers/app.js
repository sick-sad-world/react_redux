import * as ACTIONS from '../actions/types';

export const defaultApp = {
  state: 1,
  loadingStep: 1,
  userAuthenticated: false
}

export default function reducer (state = defaultApp, action) {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return {...state, userAuthenticated: true}
    case ACTIONS.LOGOUT:
      return {...state, userAuthenticated: false}
    case ACTIONS.GET_USER:
      return {...state, userAuthenticated: !!action.payload.id}
    case ACTIONS.SET_APP_STATE:
      return {...state, state: action.state}
    default:
      return state;
  }
}