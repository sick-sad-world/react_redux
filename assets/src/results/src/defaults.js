import PropTypes from 'prop-types';

export const defaultResults = {
  state: 1,
  payload: []
};

export const proptocolRegExp = /^http?s:\/\//;

export const defaultDashboardResult = {
  title: '',
  hash: '',
  image: '',
  url: '',
  author: '',
  domain: '',
  descr: '',
  found: ''
};

export const affectingProps = ['sort', 'direction', 'show_favorites', 'show_ignored', 'limit', 'author', 'search', 'exclude_search', 'url', 'since', 'before', 'language', 'source', 'set', 'ignore_source', 'ignore_set', 'is_image', 'is_video', 'is_facebook', 'is_gallery'];

export const tableStats = ['tweets', 'likes', 'shares', 'pins', 'comments', 'votes_video', 'views_video', 'comments_video'];

export const availableStats = ['title', 'url', 'author', 'found', 'image', 'wide_image', 'description', 'graphs', ...tableStats];

export const defaultInterface = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  found: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired
};
