import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import withTests from 'withTests';
import Icon from './index';

storiesOf('Icons', module)
  .addDecorator(withTests('icon'))
  .add('Simple', withInfo()(() => (
    <ol>
      <li><Icon g='bell' /> Simple icon</li>
      <li><Icon g='documents' fill='#600000' /> Simple colored icon</li>
    </ol>
  )));