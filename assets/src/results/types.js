import createTypes from 'common/type-factory';

export default createTypes('results', {
  DELETE: undefined,
  PUSH: 'PUSH',
  FAVORITE: 'FAVORITE',
  IGNORE: 'IGNORE'
});
