import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import TagList from './index';
import IconButton from '../IconButton';
import Image from '../Image';

const content = [{
  id: 1,
  value: 'Some'
}, {
  id: 2,
  value: 'List Item'
}, {
  id: 3,
  value: 'Assigned'
}, {
  id: 4,
  prefix: <Image src='https://picsum.photos/200' alt='Some' />,
  value: 'Ihor Koptielov'
}];

storiesOf('UI Components', module)
  .addDecorator(withTests('TagList'))
  .add('TagList', withState({}, (story, store) => (
    withInfo({
      propTables: [TagList],
      propTablesExclude: [IconButton]
    })(() => {
      return (
        <div>
          <div>
            <h4>Tag list</h4>
            <TagList data={content} onClose={console.log} />
          </div>
          <div>
            <h4>Empty Tag list</h4>
            <TagList />
          </div>
        </div>
      );
    })(story)
  )));

