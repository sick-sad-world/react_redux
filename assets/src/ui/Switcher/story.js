import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import Switcher from './index';
import Raw from './component';

storiesOf('FormElements', module)
  .addDecorator(withTests('Switcher'))
  .add('Switcher', withState({}, (story, store) => (
    withInfo({
      propTables: [Raw],
      propTablesExclude: [Switcher]
    })(() => {
      return (
        <div>
          <Switcher
            label='Simple switcher'
            name='simple'
            value={store.state.simple}
            onChange={(value) => store.set(value)}
            options={{
              'Active': 1,
              'Inactive': 0
            }}
          />
          <div style={{ height: '24px' }} />
          <Switcher
            label='Triple switcher'
            name='triple'
            value={store.state.triple}
            onChange={(value) => store.set(value)}
            options={{
              'Only': 1,
              'Include': null,
              'Omit': 0
            }}
          />
          <div style={{ height: '24px' }} />
        </div>
      );
    })(story)
  )));

