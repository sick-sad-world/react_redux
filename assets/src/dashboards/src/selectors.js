import createSelector from 'common/selector-creator';

const getDashboardsState = ({ dashboards }) => dashboards.state;

const getDashboards = ({ dashboards }) => dashboards.payload;

const getCurrentId = ({ dashboards }, props) => parseInt(props.params.id, 10) || 0;

const getTargetUrl = ({ dashboards }, props) => props.params.name;

const getScrollTo = ({ dashboards }, props) => parseInt(props.params.column, 10) || null;

export function makeNavSelector() {
  const selector = createSelector(
    getDashboards,
    dashboards => ({
      payload: dashboards.map(({ id, name, column_ids, url }) => ({ id, name, counter: column_ids.length, url }))
    })
  );

  return (state, props) => selector(state, props);
}

export function makeContainerSelector() {
  const selector = createSelector(
    getDashboards,
    getTargetUrl,
    getScrollTo,
    (dashboards, target, scrollTo) => ({
      payload: dashboards.find(({ url }) => url === target),
      scrollTo
    })
  );
  return (state, props) => selector(state, props);
}
