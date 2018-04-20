import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import TagList from './index';
import IconButton from '../IconButton';


storiesOf('UI Components', module)
  .addDecorator(withTests('TagList'))
  .add('TagList', withState({}, (story, store) => (
    withInfo({
      propTables: [TagList],
      propTablesExclude: [IconButton]
    })(() => {
      return (
        <div>
          <TagList />
        </div>
      );
    })(story)
  )));

