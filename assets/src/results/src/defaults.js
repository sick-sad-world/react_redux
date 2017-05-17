import PropTypes from 'prop-types';

export const defaultResults = {
  state: 1,
  payload: []
};

export const tableStats = ['tweets', 'likes', 'shares', 'pins', 'comments', 'votes_video', 'views_video', 'comments_video'];

export const availableStats = ['title', 'url', 'author', 'found', 'image', 'wide_image', 'description', 'graphs', ...tableStats];

export const defaultInterface = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  found: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired
};
