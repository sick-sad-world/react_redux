export const TABLE = 18;
export const CONTENT = 125;
export const DETAIL = 20;

export default {
  title: {
    max: 63,
    disabled: true,
    default: true,
    row: 0
  },
  url: {
    disabled: true,
    default: true,
    height: 0
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
  domain: {
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
