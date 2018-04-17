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
        <Notification title='Some information'>Samle of info notification</Notification><br />
      </li>
      <li>
        <Notification type='success' title='Success is always good'>Sample of Success notification</Notification><br />
      </li>
      <li>
        <Notification type='warning' title='Look at me!'>Samle of warning notification</Notification><br />
      </li>
      <li>
        <Notification type='error' title='We need to fix this now!'>Sample of Error notification</Notification><br />
      </li>
      <li>
        <Notification raised title='Success is always good'>Sample of Raised notification</Notification><br />
      </li>
    </ol>
  )));