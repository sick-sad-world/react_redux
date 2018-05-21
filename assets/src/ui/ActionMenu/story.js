import { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import { withTests } from 'with';
import ActionMenu from './index';


storiesOf('UI Components', module)
  .addDecorator(withTests('ActionMenu'))
  .add(
    'Action Menu',
    withInfo({
      propTablesExclude: []
    })(() => (
      <div>
        <ActionMenu
          open
          data={[
            {
              label: 'Manage feeds',
              handler: action('manage-feeds')
            },
            {
              label: 'Edit item',
              handler: action('edit-item')
            },
            '---',
            {
              label: 'Delete item',
              icon: 'trash',
              handler: action('delete-item')
            }
          ]}
        />
      </div>
    ))
  );