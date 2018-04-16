import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import Media from './index';

storiesOf('Global Elements', module)
  .addDecorator(withTests('Media'))
  .add('Media', withState({}, (story, store) => (
    withInfo({
      propTables: [Media]
    })(() => {
      return (
        <div />
      );
    })(story)
  )));

