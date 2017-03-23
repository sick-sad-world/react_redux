import createSelector from '../helpers/selectorCreator';

const getUserState = ({user}) => user.state;
const getUserData = ({user}) => user.payload;

export const makeUserSelector = () => createSelector(
  getUserState,
  getUserData,
  (state, payload) => ({
    state, payload
  }));