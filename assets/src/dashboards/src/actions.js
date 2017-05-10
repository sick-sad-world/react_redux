import createAction from 'common/action-factory';
import types from './types';

export const setDashboardsState = state => ({
  type: types.STATE,
  state
});

export const getDashboards = () => (dispatch) => {
  const data = {
    type: types.READ,
    payload: [{
      id: 1,
      name: 'Dashboard',
      column_ids: []
    }]
  };
  dispatch(data);
  return Promise.resolve(data);
};

// export const getDashboards = createAction({
//   type: types.READ,
//   state_type: types.STATE,
//   url: 'dashboards',
//   pendingMessage: 'Reading dashboards data...',
//   successMessage: 'Dashboard data has been read.'
// });

export const createDashboard = createAction({
  type: types.CREATE,
  state_type: types.STATE,
  url: 'add_dashboard',
  pendingMessage: 'Creating new dashboard...',
  successMessage: 'Dashboard succesfully created.'
});

export const editDashboard = createAction({
  type: types.UPDATE,
  state_type: types.STATE,
  url: 'dashboard',
  pendingMessage: 'Updating dashboard data...',
  successMessage: 'Dashboard data has been updated.'
});

export const deleteDashboard = createAction({
  type: types.DELETE,
  state_type: types.STATE,
  url: 'remove_dashboard',
  pendingMessage: 'Deleting dashboard...',
  successMessage: 'Dashboard was deleted.'
});
