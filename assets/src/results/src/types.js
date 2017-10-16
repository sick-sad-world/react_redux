import createTypes from 'common/type-factory';

export default createTypes('results', {
  STATE: 'STATE',
  PUSH: 'PUSH',
  FAVORITE: 'FAVORITE',
  IGNORE: 'IGNORE',
  ERROR: 'ERROR'
});
