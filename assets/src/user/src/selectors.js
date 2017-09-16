import createSelector from 'common/selector-creator';

const getUserState = ({ user }) => user.state;
const getUserData = ({ user }) => user.payload;

export function makeWorkspaceSelector() {
  const selector = createSelector(
    getUserState,
    getUserData,
    (state, { id, image, fullname, position }) => ({
      state,
      user: { id, image, fullname, position }
    })
  );
  return (state, props) => selector(state, props);
}

export function makeContainerSelector() {
  const selector = createSelector(
    getUserState,
    getUserData,
    (state, payload) => ({
      state, payload
    })
  );
  return (state, props) => selector(state, props);
}

export function makeEmailsSelector() {
  const selector = createSelector(
    getUserState,
    getUserData,
    (state, payload) => ({
      state,
      email: payload.email,
      data: payload.email_bcc
    })
  );
  return (state, props) => selector(state, props);
}
