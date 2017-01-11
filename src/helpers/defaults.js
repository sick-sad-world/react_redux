export const defaultAppState = {
  state: 1, // 0 -error, 1 -init, 2 -ready, 3 -reading, 4 -creation, 5 -editing, 6 -deleting, 7 -sorting 
  userState: false,
  loadingStep: 0,
  messages: []
}

export const defaultMessage = {
  type: 'info', // info, loading, error, success, warning
  entity: '',   // user, alert, report, source, set, column, link
  duration: 0   // Time message will be visible, 0 - infinite
}

export const defaultUser = {
  id: null,
  email: '',
  email_bcc: [],
  name: '',
  fullname: 'Name Surname',
  position: 'user position',
  status: null,
  is_admin: '0',
  image: '/img/ph_user.png'
};

export const defReport = {
  id: 0,
  order: 0,
  active: 1,
  name: '',
  columns: [0],
  frequency: 1440,
  next_send: '',
  last_sent: '',
  recipient: ''
}

export const defAlert = {
  id: 0,
  order: 0,
  active: 1,
  name: '',
  columns: [0],
  frequency: 15,
  recipient: ''
}

export const defColumnData = {
  show_favorites: 0,
  show_ignored: 0,
  autoreload: 0,
  infinite: 1,
  limit: 30,
  sort: 'rate_likes',
  direction: 'desc',
  author: undefined,
  search: undefined,
  exclude_search: undefined,
  url: undefined,
  since: undefined,
  before: undefined,
  language: undefined,
  source: [],
  set: [],
  ignore_source: [],
  ignore_set: [],
  is_image: undefined,
  is_video: undefined,
  is_facebook: undefined,
  is_gallery: undefined
}

export const defColumn = {
  id: 0,
  order: 0,
  open: 1,
  name: '',
  data: defColumnData,
  display_settings: ['title', 'found', 'url', 'image', 'description', 'likes', 'tweets', 'shares']
}

export const defColumnParameters = {
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
  language: [
    {label: 'English', value: 'English'},
    {label: 'French', value: 'French'},
    {label: 'German', value: 'German'},
    {label: 'Dutch', value: 'Dutch'},
    {label: 'Spanish', value: 'Spanish'},
    {label: 'Korean', value: 'Korean'},
    {label: 'Arabic', value: 'Arabic'},
    {label: 'Chinese', value: 'Chinese'},
    {label: 'Hindi', value: 'Hindi'},
    {label: 'Japanese', value: 'Japanese'},
    {label: 'Greek', value: 'Greek'},
    {label: 'Unknown', value: 'Unknown'},
    {label: 'Undetected', value: 'Undetected'}
  ],
  autoReloadOptions: [
    {label: '15sec', value: 15},
    {label: '30sec', value: 30},
    {label: '1min', value: 60},
    {label: '2min', value: 120},
    {label: '5min', value: 300},
    {label: '10min', value: 600}
  ],
  sortPrefix: [
    {label: 'rate', value: 'rate'},
    {label: 'maxrate', value: 'maxrate'},
    {label: 'hotness', value: 'hotness'},
    {label: 'acc', value: 'acc'}
  ],
  sortProperty: [
    {label: 'found', value: 'found'},
    {label: 'tweets', value: 'tweets'},
    {label: 'likes', value: 'likes'},
    {label: 'shares', value: 'shares'},
    {label: 'pins', value: 'pins'},
    {label: 'comments_video', value: 'comments_video'},
    {label: 'comments', value: 'comments'},
    {label: 'votes_video', value: 'votes_video'},
    {label: 'views_video', value: 'views_video'}
  ]
}