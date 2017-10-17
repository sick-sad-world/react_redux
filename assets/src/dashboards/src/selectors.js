import createSelector from 'common/selector-factory';

const getDashboards = ({ dashboards }) => dashboards;

const getCurrentId = ({ dashboards }, props) => parseInt(props.params.id, 10) || 0;

const getTargetUrl = ({ dashboards }, props) => props.params.name;

const getCol = ({ dashboards }, props) => parseInt(props.params.col, 10) || null;

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
    getCol,
    (dashboards, target, col) => ({
      payload: dashboards.find(({ url }) => url === target),
      col
    })
  );
  return (state, props) => selector(state, props);
}
