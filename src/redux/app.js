import * as ACTIONS from '../helpers/types';
import moment from 'moment';
import createAction from '../helpers/actionFactory';
import { notification } from './notifications';
import { getColumns } from './columns';
import { getResults } from './results';
import { getSets } from './sets';
import { getSources } from './sources';
import { getAlerts } from './alerts';
import { getReports } from './reports';

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

export const errorHandler = (error) => (dispatch) => {
  if (error instanceof Error || error.event) {
    throw error;
  } else {
    // Create notification of process failed ending
    // ===========================================================================
    if (error.id) dispatch(notification({
      id: error.id,
      type: 'error',
      text: error.text
    }));
    
    // Set User state to ERROR
    // ===========================================================================
    if (error.state) {
      dispatch({
        type: error.state,
        state: 0
      });  
    }
  }
};

export const setAppState = (state) => (dispatch) => dispatch({
  type: ACTIONS.SET_APP_STATE,
  state: state
});

export const login = createAction({
  type: ACTIONS.LOGIN,
  state_type: null,
  url: 'login',
  pendingMessage: 'Check auth credentials...',
  successMessage: 'Logged in.'
});

export const logout = createAction({
  type: ACTIONS.LOGOUT,
  state_type: null,
  url: 'logout',
  pendingMessage: 'Shutting down session...',
  successMessage: 'Logged out.'
});

export const fetchData = (options) => {

  options = {
    ...options,
    state: false,
    notification: false
  };

  return (dispatch) => Promise.all([
    dispatch(getColumns({data: 1}, options)),
    dispatch(getSets(null, options)),
    dispatch(getSources(null, options)),
    dispatch(getAlerts(null, options)),
    dispatch(getReports(null, options))
  ]);
}

export const getAllResults = (data) => (dispatch) => {
  let columns;
  let ids = {};
  let notificationId = moment().unix();

  // Pick exacly columns data to iterate over for Results fetching
  // ===========================================================================
  data.forEach((item) => {
    if (item && item.type === ACTIONS['GET_COLUMNS']) columns = item.payload;
  });

  // Create our [Top-level] Promise chain
  // ===========================================================================
  let results =  Promise.all(
    columns.map((column, i) => {
      // If column hidden - do nothing
      // ===========================================================================
      if (!column.open) return null;

      // Define time delay and set id to hash of columns being fetched
      // ===========================================================================
      let delay = (i > 4) ? i * 1200 : 0;
      ids[column.id] = true;

      // Promise wrapper around timeout
      // ===========================================================================
      return new Promise((resolve, reject) => {

        // Run our call and simple forward results to [Upper-level] promise chain
        // ===========================================================================
        setTimeout(() => {
          return dispatch(getResults(column.data, {id: column.id}), {
            id: column.id,
            notification: false
          }).then(resolve).catch(reject)
        }, delay);

      }).then(() => {
        // When code is done - update our message by removing [ID] of column
        // wich result loading is done from list
        // ===========================================================================
        delete ids[column.id];
        return dispatch(notification({
          id: notificationId,
          type: 'loading',
          text: `Results for columns ${Object.keys(ids).join(',')} downloading now...`
        }));
      });
    })
  ).then(() => dispatch(notification({
    id: notificationId,
    visible: false
  })));

  // Send message at a start
  // ===========================================================================
  dispatch(notification({
    id: notificationId,
    type: 'loading',
    text: `Results for columns ${Object.keys(ids).join(',')} downloading now...`
  }));

  return results;
}