import createSelector from 'common/selector-factory';

const getAppState = ({ app }) => app.state;
const getAppError = ({ app }) => app.error;

export function makeAppSelector() {
  const selector = createSelector(
  getAppState,
  getAppError,
  (state, error) => ({
    state, error
  }));

  return (state, props) => selector(state, props);
}
