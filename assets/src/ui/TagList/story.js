import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import TagList from './index';
import IconButton from '../IconButton';
import Image from '../Image';
import Badge from '../Badge';
import Icon from '../Icon';

const content = [{
  id: 1,
  value: 'Some'
}, {
  id: 2,
  prefix: <Icon g='bell' />,
  value: 'List Item'
}, {
  id: 3,
  value: 'Assigned'
}, {
  id: 4,
  prefix: <Image src='https://picsum.photos/200' alt='Some' />,
  value: 'Ihor Koptielov'
}, {
  id: 5,
  prefix: <Badge theme='accent'>123</Badge>,
  value: 'List of Tags'
}, {
  id: 6,
  value: 'Cool item'
}, ];

storiesOf('UI Components', module)
  .addDecorator(withTests('TagList'))
  .add('TagList', withState({}, (story, store) => (
    withInfo({
      propTables: [TagList],
      propTablesExclude: [IconButton, Icon, Image, Badge]
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

