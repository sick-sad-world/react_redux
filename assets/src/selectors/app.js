import createSelector from '../helpers/selectorCreator';

const getAppState = ({app}) => app.state;
const getAppError = ({app}) => app.error;
const getAppLoadingStep = ({app}) => app.loadingStep;

export const makeAppSelector = () => createSelector(
  getAppState,
  getAppError,
  getAppLoadingStep,
  (state, error, loadingStep) => ({
    state, error, loadingStep
  }));