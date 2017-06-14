import PropTypes from 'prop-types';

export const defaultResults = {
  state: 1,
  error: null,
  payload: []
};

export const limit = 30;

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
