import createSelector from 'common/selector-creator';

const getUserState = ({ user }) => user.state;
const getUserData = ({ user }) => user.payload;

export function makeWorkspaceSelector() {
  return createSelector(
    getUserData,
    ({ id, image, fullname, position }) => ({
      user: { id, image, fullname, position }
    }));
}

export function makeContainerSelector() {
  return createSelector(
    getUserState,
    getUserData,
    (state, payload) => ({
      state, payload
    }));
}

export function makeEmailsSelector() {
  return createSelector(
    getUserState,
    getUserData,
    (state, payload) => ({
      state,
      email: payload.email,
      data: payload.email_bcc
    }));
}
