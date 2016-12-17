export const defaultAppState = {
  appState: 0, // 0 -init, 1 -fetching, 2 -ready, 3 -loading, 4 -error 
  userState: false,
  loadingState: 'App initializing',
  loadingStep: 0
}

export const defaultUser = {
  id: null,
  hash: '',
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