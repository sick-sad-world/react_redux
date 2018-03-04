import results from '../jest-test-results.json';
import { withTests as wtests } from '@storybook/addon-jest';
import { withState as wstate } from '@dump247/storybook-state';

export const withTests = wtests({
  results,
  filesExt: '\.{1}test.js$'
});

export const withState = (opts, storyFn) => (story) => {
  return wstate(opts, (store) => storyFn(story, store))(story);
};