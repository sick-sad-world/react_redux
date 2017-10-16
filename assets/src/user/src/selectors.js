import createSelector from 'common/selector-factory';

const getUserData = ({ user }) => user;

export function makeWorkspaceSelector() {
  const selector = createSelector(
    getUserData,
    ({ id, image, fullname, position }) => ({
      user: { id, image, fullname, position }
    })
  );
  return (state, props) => selector(state, props);
}

export function makeContainerSelector() {
  const selector = createSelector(
    getUserData,
    payload => ({ payload })
  );
  return (state, props) => selector(state, props);
}

export function makeEmailsSelector() {
  const selector = createSelector(
    getUserData,
    payload => ({
      email: payload.email,
      data: payload.email_bcc
    })
  );
  return (state, props) => selector(state, props);
}
