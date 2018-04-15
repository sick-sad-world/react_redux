import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests } from 'with';
import Notification from './index';

storiesOf('UI Components', module)
  .addDecorator(withTests('Notification'))
  .add('Notification', withInfo()(() => (
    <ol>
      <li>
        <Notification>Samle of info notification</Notification>
      </li>
      <li>
        <Notification type='success'>Sample of Success notification</Notification>
      </li>
      <li>
        <Notification type='warning'>Samle of warning notification</Notification>
      </li>
      <li>
        <Notification type='error'>Sample of Error notification</Notification>
      </li>
    </ol>
  )));
