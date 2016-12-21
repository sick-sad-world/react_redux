export const defaultAppState = {
  appState: 0, // 0 -init, 1 -fetching, 2 -ready, 3 -loading, 4 -error 
  userState: false,
  loadingState: 'App initializing',
  loadingStep: 0
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
  author: '',
  search: '',
  exclude_search: '',
  url: '',
  since: '',
  before: '',
  language: 'Any',
  source: [],
  set: [],
  ignore_source: [],
  ignore_set: [],
  is_image: 'NaN',
  is_video: 'NaN',
  is_facebook: 'NaN',
  is_gallery: 'NaN'
}

export const defColumn = {
  id: 0,
  order: 0,
  open: 1,
  name: '',
  data: defColumnData,
  display_settings: ['title', 'found', 'url', 'image', 'description', 'likes', 'tweets', 'shares']
}