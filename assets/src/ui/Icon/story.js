import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import withTests from 'withTests';
import Icon, { IconButton, IconLink } from './index';

storiesOf('Global Elements', module)
  .addDecorator(withTests('icon'))
  .add('Icons', withInfo({
    propTablesExclude: [BrowserRouter]
  })(() => (
    <BrowserRouter>
      <ul>
        <li><Icon g='bell' /> Simple icon</li>
        <li><Icon g='documents' fill='#600000' /> Simple colored icon</li>
        <li><IconButton g='deselect' title='Ding dong' /> Button as icon with title</li>
        <li><IconLink to='some' g='home' title='Ding dong' /> React router as icon with title</li>
      </ul>
    </BrowserRouter>
  )));