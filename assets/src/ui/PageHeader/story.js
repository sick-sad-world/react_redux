import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import PageHeader from './index';

storiesOf('UI Components', module)
  .addDecorator(withTests('Progress'))
  .add('Progress', withState({ radial: false }, (story, store) => (
    withInfo({
      propTables: [PageHeader]
    })(() => {
      return (
        <section>
          <PageHeader />
        </section>
      )
    })(story)
  )));



