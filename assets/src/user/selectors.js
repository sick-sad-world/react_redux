import createSelector from 'common/selector-creator';

const getUserState = ({ user }) => user.state;
const getUserData = ({ user }) => user.payload;

export const makeWorkspaceSelector = () => createSelector(
  getUserData,
  ({ id, image, fullname, position }) => ({
    user: { id, image, fullname, position }
  }));

export const makeContainerSelector = () => createSelector(
  getUserState,
  getUserData,
  (state, payload) => ({
    state, payload
  }));

export const makeEmailsSelector = () => createSelector(
  getUserState,
  getUserData,
  (state, payload) => ({
    state,
    email: payload.email,
    data: payload.email_bcc
  }));
