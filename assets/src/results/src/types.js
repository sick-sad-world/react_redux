import createTypes from 'common/type-factory';

export default createTypes('results', {
  PUSH: 'PUSH',
  FAVORITE: 'FAVORITE',
  IGNORE: 'IGNORE',
  ERROR: 'ERROR'
});
