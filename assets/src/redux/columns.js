import { find } from 'lodash';
import { GET_COLUMNS, ADD_COLUMN, EDIT_COLUMN, REMOVE_COLUMN, SET_COLUMN_STATE } from '../helpers/types';
import createReducer from '../helpers/reducer-factory';
import createAction from '../helpers/action-factory';

export const defDisplaySettings = ['title', 'found', 'url', 'image', 'description', 'likes', 'tweets', 'shares'];

export const defColumnData = {
  show_favorites: 0,
  show_ignored: 0,
  autoreload: 0,
  infinite: 1,
  limit: 30,
  sort: 'rate_likes',
  direction: 'desc',
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
  display_settings: defDisplaySettings,
  data: defColumnData
};

export const defColumnParameters = {
  advRegExp: /MIN|MAX|LIKE/,
  displaySettings: [
    'title',
    'url',
    'author',
    'found',
    'image',
    'wide_image',
    'description',
    'graphs',
    'likes',
    'tweets',
    'pins',
    'shares',
    'comments',
    'votes_video',
    'views_video',
    'comments_video'
  ],
  language: [{
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
  }],
  autoReloadOptions: [{
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
  }],
  sortPrefix: [{
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
  }],
  sortProperty: [{
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
  }]
};

export const decomposeColumnSort = (sort = defColumnData.sort) => {
  let prefix = find(defColumnParameters.sortPrefix, (pref) => sort.indexOf(pref.value) > -1);
  let property = find(defColumnParameters.sortProperty, (prop) => sort.indexOf(prop.value) > -1);
  return {
    sort: undefined,
    sort_pref: (prefix) ? prefix.value : '',
    sort_prop: (property) ? property.value : '',
  }
};

export const composeColumnSort = (pref, prop) => (pref && prop !== 'found') ? pref + '_' + prop : prop;

export default createReducer({
  GET: GET_COLUMNS,
  ADD: ADD_COLUMN,
  EDIT: EDIT_COLUMN,
  REMOVE: REMOVE_COLUMN,
  STATE: SET_COLUMN_STATE
});

export const getColumns = createAction({
  type: GET_COLUMNS,
  state_type: SET_COLUMN_STATE,
  url: 'columns',
  pendingMessage: 'Reading column data...',
  successMessage: 'Column data has been read.'
});

export const createColumn = createAction({
  type: ADD_COLUMN,
  state_type: SET_COLUMN_STATE,
  url: 'add_column',
  pendingMessage: 'Creating new column...',
  successMessage: 'Column succesfully created.'
});

export const editColumn = createAction({
  type: EDIT_COLUMN,
  state_type: SET_COLUMN_STATE,
  url: 'column',
  pendingMessage: 'Updating column data...',
  successMessage: 'Column data has been updated.'
});

export const deleteColumn = createAction({
  type: REMOVE_COLUMN,
  state_type: SET_COLUMN_STATE,
  url: 'remove_column',
  pendingMessage: 'Deleting column...',
  successMessage: 'Column was deleted.'
});