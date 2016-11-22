import { createSelector } from 'reselect';

const getUser = (state) => state.user;

export default createSelector(
  [ getUser ],
  (user) => {
    return user;
  }
);