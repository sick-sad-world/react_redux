import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests } from 'with';
import { ProgressRadial } from './index';

storiesOf('UI Components', module)
  .addDecorator(withTests('Progress'))
  .add('Progress',  withInfo({
      propTables: [ProgressRadial]
    })(() => {
      return (
        <div style={{textAlign: 'center'}}>
          <ProgressRadial />
          <div style={{ height: '50px' }} />
        </div>
      );
    }));

