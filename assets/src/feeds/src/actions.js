import moment from 'moment';
import createAction from 'common/action-factory';
import fetch from 'src/communication';
import types from './types';
import { testUrls } from './defaults';

export const setFeedsState = state => ({
  type: types.STATE,
  state
});

export const getFeeds = createAction({
  type: types.READ,
  state_type: types.STATE,
  url: 'sources',
  pendingMessage: 'Reading sources data...',
  successMessage: 'Sources data has been read.'
});

export const createFeed = createAction({
  type: types.CREATE,
  state_type: types.STATE,
  url: 'add_source',
  pendingMessage: 'Creating new source...',
  successMessage: 'Source succesfully created.'
});

export const addFeed = createAction({
  type: types.ADD,
  state_type: types.STATE,
  url: 'add_source',
  pendingMessage: 'Creating new source...',
  successMessage: 'Source succesfully created.'
});

export const removeFeed = createAction({
  type: types.REMOVE,
  state_type: types.STATE,
  url: 'remove_source',
  pendingMessage: 'Removing source from set...',
  successMessage: 'Source succesfully removed.'
});

export const deleteFeed = createAction({
  type: types.DELETE,
  state_type: types.STATE,
  url: 'remove_source',
  pendingMessage: 'Deleting source...',
  successMessage: 'Source was deleted.'
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
