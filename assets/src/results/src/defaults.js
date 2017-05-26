import PropTypes from 'prop-types';

export const defaultResults = {
  state: 1,
  error: null,
  payload: []
};

export const limit = 30;

export const gutter = 12;

export const proptocolRegExp = /^https?:\/\/w{0,3}\.?/;

export const tableStatsRegExp = /likes|shares|video|reddit|comments|pins|tweets/;

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
  all: ['title', 'url', 'author', 'domain', 'found', 'image', 'wide_image', 'description', 'graphs', 'likes', 'tweets', 'pins', 'shares', 'comments', 'votes_video', 'views_video', 'comments_video'],
  table: ['tweets', 'likes', 'shares', 'comments', 'votes_video', 'views_video', 'comments_video', 'pins', 'ups_reddit', 'downs_reddit'],
  default: ['title', 'found', 'url', 'image', 'description', 'likes', 'tweets', 'shares'],
  map: {
    url: {
      disabled: true,
      default: true,
      height: 0
    },
    title: {
      height: 68,
      disabled: true,
      default: true
    },
    author: {
      height: 24,
      sibling: ['found', 'domain']
    },
    found: {
      height: 24,
      sibling: ['author', 'domain'],
      default: true
    },
    domain: {
      height: 24,
      sibling: ['author', 'found'],
      default: true
    },
    image: {
      height: 130,
      default: true,
      sibling: ['description', 'wide_image'],
      child: 'wide_image'
    },
    wide_image: {
      height: 160,
      sibling: ['description', 'image'],
      opponent: ['description']
    },
    description: {
      height: 130,
      default: true,
      sibling: ['image', 'wide_image'],
      opponent: ['wide_image']
    },
    likes: {
      height: 18,
      table: true,
      default: true
    },
    tweets: {
      height: 18,
      table: true,
      default: true
    },
    pins: {
      height: 18,
      table: true
    },
    shares: {
      height: 18,
      table: true,
      default: true
    },
    comments: {
      height: 18,
      table: true
    },
    votes_video: {
      height: 18,
      table: true
    },
    views_video: {
      height: 18,
      table: true
    },
    comments_video: {
      height: 18,
      table: true
    }
  }
};


export const defaultInterface = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  found: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired
};
