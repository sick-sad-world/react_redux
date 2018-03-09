import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import Dropdown from './index';
import Raw from './component';

storiesOf('FormElements', module)
  .addDecorator(withTests('Dropdown'))
  .add('Dropdown', withState({}, (story, store) => (
    withInfo({
      propTables: [Raw],
      propTablesExclude: [Dropdown]
    })(() => {
      return (
        <div>
          <Dropdown
            name='simple'
            label='Simple dropdown'
            value={store.state.simple}
            onChange={(value) => store.set(value)}
            options={[
              { value: 'one', label: 'One' },
              { value: 'two', label: 'Two' },
              { value: 'three', label: 'Three' }
            ]}
          />
          <div style={{ height: '50px' }} />
          <div style={{ height: '50px' }} />
          <div style={{ height: '50px' }} />
          <div style={{ height: '50px' }} />
        </div>
      );
    })(story)
  )));

