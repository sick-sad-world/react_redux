import createSelector from 'common/selector-creator';

const getDashboardsState = ({ dashboards }) => dashboards.state;

const getDashboards = ({ dashboards }) => dashboards.payload;

const getCurrentId = ({ dashboards }, props) => parseInt(props.params.id, 10) || 0;

export function makeNavSelector() {
  return createSelector(
    getDashboards,
    dashboards => ({
      payload: dashboards.map(({ id, name, column_ids }) => ({ id, name, counter: column_ids.length }))
    })
  );
}

export function makeContainerSelector() {
  return createSelector(
    getDashboards,
    getCurrentId,
    (dashboards, curId) => ({
      payload: dashboards.find(({ id }) => id === curId)
    }));
}
