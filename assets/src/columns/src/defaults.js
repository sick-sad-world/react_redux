import PropTypes from 'prop-types';
import { numBool, directionString } from 'common/typecheck';

export const defColumnData = {
  autoreload: 0,
  infinite: 1,
  sort: 'rate_likes',
  limit: 30,
  direction: 'desc'
};

export const availableColumnData = {
  show_favorites: 0,
  show_ignored: 0,
  author: '',
  search: '',
  exclude_search: '',
  url: '',
  since: '',
  before: '',
  language: '',
  source: [],
  set: [],
  ignore_source: [],
  ignore_set: [],
  is_image: '',
  is_video: '',
  is_facebook: '',
  is_gallery: ''
};

export const defColumn = {
  id: null,
  order: null,
  open: 1,
  name: '',
  data: defColumnData,
  display_settings: undefined
};

export const sortingOptions = {
  sortPrefix: [
    {
      label: 'rate',
      value: 'rate'
    }, {
      label: 'maxrate',
      value: 'maxrate'
    }, {
      label: 'hotness',
      value: 'hotness'
    }, {
      label: 'acc',
      value: 'acc'
    }
  ],
  sortProperty: [
    {
      label: 'found',
      value: 'found'
    }, {
      label: 'tweets',
      value: 'tweets'
    }, {
      label: 'likes',
      value: 'likes'
    }, {
      label: 'shares',
      value: 'shares'
    }, {
      label: 'pins',
      value: 'pins'
    }, {
      label: 'comments_video',
      value: 'comments_video'
    }, {
      label: 'comments',
      value: 'comments'
    }, {
      label: 'votes_video',
      value: 'votes_video'
    }, {
      label: 'views_video',
      value: 'views_video'
    }
  ]
};

export const editOptions = {
  advRegExp: /MIN|MAX|LIKE/,
  language: [
    {
      label: 'English',
      value: 'English'
    }, {
      label: 'French',
      value: 'French'
    }, {
      label: 'German',
      value: 'German'
    }, {
      label: 'Dutch',
      value: 'Dutch'
    }, {
      label: 'Spanish',
      value: 'Spanish'
    }, {
      label: 'Korean',
      value: 'Korean'
    }, {
      label: 'Arabic',
      value: 'Arabic'
    }, {
      label: 'Chinese',
      value: 'Chinese'
    }, {
      label: 'Hindi',
      value: 'Hindi'
    }, {
      label: 'Japanese',
      value: 'Japanese'
    }, {
      label: 'Greek',
      value: 'Greek'
    }, {
      label: 'Unknown',
      value: 'Unknown'
    }, {
      label: 'Undetected',
      value: 'Undetected'
    }
  ],
  autoReloadOptions: [
    {
      label: '15sec',
      value: 15
    }, {
      label: '30sec',
      value: 30
    }, {
      label: '1min',
      value: 60
    }, {
      label: '2min',
      value: 120
    }, {
      label: '5min',
      value: 300
    }, {
      label: '10min',
      value: 600
    }
  ]
};

export const defaultDashboardInterface = {
  autoreload: PropTypes.oneOf([0, ...editOptions.autoReloadOptions.map(({ value }) => value)]).isRequired,
  infinite: numBool.isRequired,
  sort: PropTypes.string.isRequired,
  direction: directionString.isRequired,
  limit: PropTypes.number.isRequired
};

export const defaultDataInterface = {
  ...defaultDashboardInterface,
  show_favorites: numBool,
  show_ignored: numBool,
  author: PropTypes.string,
  search: PropTypes.string,
  exclude_search: PropTypes.string,
  url: PropTypes.string,
  since: PropTypes.number,
  before: PropTypes.number,
  language: PropTypes.string,
  source: PropTypes.arrayOf(PropTypes.number),
  set: PropTypes.arrayOf(PropTypes.number),
  ignore_source: PropTypes.arrayOf(PropTypes.number),
  ignore_set: PropTypes.arrayOf(PropTypes.number),
  is_image: PropTypes.oneOfType([PropTypes.string, numBool]),
  is_video: PropTypes.oneOfType([PropTypes.string, numBool]),
  is_facebook: PropTypes.oneOfType([PropTypes.string, numBool]),
  is_gallery: PropTypes.oneOfType([PropTypes.string, numBool])
};

export const coreInterface = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  order: PropTypes.number,
  open: numBool
};

export const defaultInterface = {
  ...coreInterface,
  display_settings: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.shape(defaultDataInterface)
};

