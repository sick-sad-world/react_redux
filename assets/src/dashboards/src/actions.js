import createAction from 'common/action-factory';
import types from './types';

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
//   action: types.READ,
//   call: 'dashboards'
// });

export const createDashboard = createAction({
  action: types.CREATE,
  call: 'add_dashboard'
});

export const editDashboard = createAction({
  action: types.UPDATE,
  call: 'dashboard'
});

export const deleteDashboard = createAction({
  action: types.DELETE,
  call: 'remove_dashboard'
});
