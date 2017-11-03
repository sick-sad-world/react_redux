import PropTypes from 'prop-types';

export const TABLE = 18;
export const CONTENT = 125;
export const DETAIL = 20;

export const predefined = [
  {
    value: 'custom',
    label: 'Customize'
  },
  {
    height: 150,
    value: 'deck',
    label: 'TweetDeck like'
  },
  {
    height: 200,
    value: 'gallery',
    label: 'Gallery'
  },
  {
    height: 90,
    value: 'short',
    label: 'Short one'
  }
];

export const dsValueShape = PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]);

export default {
  title: {
    max: 63,
    disabled: false,
    default: true,
    row: 0
  },
  author: {
    height: DETAIL,
    row: 1
  },
  found: {
    height: DETAIL,
    default: true,
    row: 1
  },
  url: {
    height: DETAIL,
    default: true,
    row: 1
  },
  image: {
    height: CONTENT,
    default: true,
    row: 2
  },
  wide_image: {
    height: CONTENT,
    parent: 'image',
    row: 2
  },
  description: {
    max: CONTENT,
    default: true,
    row: 3
  },
  graphs: {
    height: 120,
    default: false,
    row: 4
  },
  likes: {
    height: TABLE,
    table: true,
    default: true,
    graphs: true
  },
  tweets: {
    height: TABLE,
    table: true,
    graphs: true
  },
  pins: {
    height: TABLE,
    table: true,
    graphs: true
  },
  shares: {
    height: TABLE,
    table: true,
    graphs: true
  },
  comments: {
    height: TABLE,
    table: true,
    graphs: true
  },
  votes_video: {
    height: TABLE,
    table: true,
    graphs: true
  },
  views_video: {
    height: TABLE,
    table: true,
    graphs: true
  },
  comments_video: {
    height: TABLE,
    table: true,
    graphs: true
  }
};
