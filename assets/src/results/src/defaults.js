import PropTypes from 'prop-types';

export const defaultResults = {
  state: 1,
  error: null,
  payload: []
};

export const limit = 30;

export const foundFormat = 'YYYY-MM-DD HH:mm:ss';

export const proptocolRegExp = /^https?:\/\/w{0,3}\.?/;

export const defaultDashboardResult = {
  title: '',
  hash: '',
  image: '',
  url: '',
  author: '',
  domain: '',
  descr: '',
  found: '',
  favorite: 0,
  ignore: 0
};

export const defaultInterface = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  found: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired
};

export const defaultPropsInjected = {
  location: PropTypes.string.isRequired,
  sort: PropTypes.string.isRequired,
  payload: PropTypes.shape(defaultInterface).isRequired,
  proptocolRegExp: PropTypes.instanceOf(RegExp).isRequired,
  refreshResult: PropTypes.func,
  favoriteResult: PropTypes.func,
  ignoreResult: PropTypes.func
};

export const customPropsInjected = {
  displaySettings: PropTypes.arrayOf(PropTypes.string).isRequired,
  tableStats: PropTypes.arrayOf(PropTypes.string).isRequired,
  heights: PropTypes.objectOf(PropTypes.string)
};
