import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { setDefaults } from '@storybook/addon-info';

addDecorator(story => (
  <div style={{padding: '20px', 'backgroundColor': '#fff', 'minHeight': '100vh'}}>
    {story()}
  </div>
));

setOptions({
  name: 'Trendolizer UI',
  addonPanelInRight: true
});

setDefaults({
  styles: stylesheet => ({
    ...stylesheet,
    infoBody: {
      ...stylesheet.infoBody,
      boxShadow: 'none',
      border: 'none',
      padding: '10px 0'
    }
  }),
  inline: true
});

function loadStories() {
  require('../assets/sass/app.scss');
  require('./stories');
}

configure(loadStories, module);