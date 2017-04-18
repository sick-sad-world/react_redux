import createSelector from 'common/selector-creator';

const getAppState = ({ app }) => app.state;
const getAppError = ({ app }) => app.error;
const getAppLoadingStep = ({ app }) => app.loadingStep;

export default function makeAppSelector() {
  return createSelector(
  getAppState,
  getAppError,
  getAppLoadingStep,
  (state, error, loadingStep) => ({
    state, error, loadingStep
  }));
}
