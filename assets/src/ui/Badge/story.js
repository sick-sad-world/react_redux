import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests } from 'with';
import Badge from './index';

storiesOf('Global Elements', module)
  .addDecorator(withTests('Badge'))
  .add('Badge', withInfo()(() => (
    <ol>
      <li key='-2'><Badge value='badge' /> - simple badge</li>
      <li key='-1'>Status colors<hr /></li>
      {['error', 'warning', 'success', 'info'].map((itm, i) => (
        <li key={i}><Badge theme={itm} value='badge' /> - {itm} styled badge</li>
      ))}
      <li key='-3'>Accent colors<hr /></li>
      {['accent', 'action'].map((itm, i) => (
        <li key={i}><Badge theme={itm} value='badge' /> - {itm} styled badge</li>
      ))}
      <li key='-4'>Feeds colors<hr /></li>
      {['html', 'rss', 'facebook', 'reddit', 'twitter'].map((itm, i) => (
        <li key={i}><Badge theme={itm} value='badge' /> - {itm} styled badge</li>
      ))}
    </ol>
  )));
