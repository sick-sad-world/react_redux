import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import { withTests } from 'with';
import IconButton from './index';

storiesOf('Icons', module)
  .addDecorator(withTests('IconButton'))
  .add('Icon Link', withInfo()(() => (
    <ol>
      <li><IconButton onClick={action('ButtonIconClick')} g='deselect' title='Ding dong' /> Button as icon with title</li>
    </ol>
  )));
