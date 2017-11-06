import { commonSelector } from 'common/selector-factory';
import { getUserAuth } from 'src/user';

const getAppState = ({ app }) => app.state;
const getAppError = ({ app }) => app.error;

export const makeAppSelector = commonSelector({ state: getAppState, error: getAppError });

export const makeAuthSelector = commonSelector({ auth: getUserAuth, state: getAppState });
