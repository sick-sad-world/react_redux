import createSelector from 'common/selector-creator';

const getDashboardsState = ({ dashboards }) => dashboards.state;

const getDashboards = ({ dashboards }) => dashboards.payload;

const getCurrentId = ({ dashboards }, props) => parseInt(props.params.id, 10) || 0;

const getTargetUrl = ({ dashboards }, props) => props.params.name;

export function makeNavSelector() {
  return createSelector(
    getDashboards,
    dashboards => ({
      payload: dashboards.map(({ id, name, column_ids, url }) => ({ id, name, counter: column_ids.length, url }))
    })
  );
}

export function makeContainerSelector() {
  return createSelector(
    getDashboards,
    getTargetUrl,
    (dashboards, target) => ({
      payload: dashboards.find(({ url }) => url === target)
    }));
}
