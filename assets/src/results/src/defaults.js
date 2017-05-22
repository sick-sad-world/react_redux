import PropTypes from 'prop-types';

export const defaultResults = {
  state: 1,
  error: null,
  payload: []
};

export const limit = 30;

export const gutter = 18;

export const proptocolRegExp = /^http?s:\/\//;

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

export const displaySettings = {
  all: ['title', 'url', 'author', 'found', 'image', 'wide_image', 'description', 'graphs', 'likes', 'tweets', 'pins', 'shares', 'comments', 'votes_video', 'views_video', 'comments_video'],
  table: ['tweets', 'likes', 'shares', 'pins', 'comments', 'votes_video', 'views_video', 'comments_video'],
  default: ['title', 'found', 'url', 'image', 'description', 'likes', 'tweets', 'shares']
};


export const defaultInterface = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  found: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired
};
