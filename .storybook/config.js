import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import '../assets/sass/app.scss';

addDecorator(story => (
  <div style={{padding: '20px', 'background-color': '#fff', 'min-height': '100vh'}}>
    {story()}
  </div>
));

function loadStories() {
  require('./stories');
}

configure(loadStories, module);