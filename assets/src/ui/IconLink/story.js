import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import withTests from 'withTests';
import IconLink from './index';

storiesOf('Icons', module)
  .addDecorator(withTests('icon'))
  .add('React Router Icon', withInfo({
    text: 'Browser router added for [react-router-dom] NavLink component correct usage within router context',
    propTablesExclude: [BrowserRouter]
  })(() => (
    <BrowserRouter>
      <ol>
        <li><IconLink onClick={action('NavLinkClick')} to='some' g='home' title='Ding dong' /> React router as icon with title</li>
        <li><IconLink onClick={action('NavLinkClick')} to='some' g='home' fill='#633200' title='Ding dong' /> Colored link</li>
      </ol>
    </BrowserRouter>
  )));