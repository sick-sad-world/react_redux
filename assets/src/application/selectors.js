import createSelector from 'common/selector-creator';

const getAppState = ({ app }) => app.state;
const getAppError = ({ app }) => app.error;
const getAppLoadingStep = ({ app }) => app.loadingStep;

export default () => createSelector(
  getAppState,
  getAppError,
  getAppLoadingStep,
  (state, error, loadingStep) => ({
    state, error, loadingStep
  }));
