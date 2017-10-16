import moment from 'moment';
import fetch from 'src/communication';
import createAction from 'common/action-factory';
import types from './types';
import { testUrls } from './defaults';

export const setFeedsState = state => ({
  type: types.STATE,
  state
});

export const getFeeds = createAction({
  action: types.READ,
  loading: types.STATE,
  call: 'sources'
});

export const createFeed = createAction({
  action: types.CREATE,
  loading: types.STATE,
  call: 'add_source'
});

export const addFeed = createAction({
  action: types.ADD,
  loading: types.STATE,
  call: 'add_source'
});

export const removeFeed = createAction({
  action: types.REMOVE,
  loading: types.STATE,
  call: 'remove_source'
});

export const deleteFeed = createAction({
  action: types.DELETE,
  loading: types.STATE,
  call: 'remove_source'
});

export const testUrl = ([...tests], url) => (dispatch, getState, { notification, clientError }) => new Promise((resolve, reject) => {
  if (!tests || !tests.length) {
    reject('Test should be an Array with any of this values: "RSS", "HTML", "Facebook"');
  }
  if (!url || !url.length) {
    reject('Provide reasonable URL to run tests');
  }

  const noteId = moment().unix();

  dispatch(notification({
    id: noteId,
    type: 'loading',
    text: `Testing url as ${tests.join(', ')} feed...`
  }));

  return Promise.all(
    tests.map(type => fetch(testUrls[type], { url }).then((payload) => {
      if (payload.length > 50) payload.length = 50;
      if (tests.length > 1) {
        tests.splice(tests.indexOf(type), 1);
        dispatch(notification({
          id: noteId,
          type: 'loading',
          text: `Testing url as ${tests.join(', ')} feed...`
        }));
      }
      return { [type]: payload };
    })
  )).then(results => results.reduce((acc, result) => ({ ...acc, ...result }), {})).then((results) => {
    dispatch(notification({
      id: noteId,
      visible: false
    }));
    return results;
  }).then(resolve);
});
