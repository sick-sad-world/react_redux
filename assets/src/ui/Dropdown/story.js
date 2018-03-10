import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import Dropdown from './index';
import Raw from './component';

const options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' },
  { value: 'four', label: 'Four' },
  { value: 'five', label: 'Five' },
  { value: 'six', label: 'Six' }
];

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
            options={options}
          />
          <div style={{ height: '50px' }} />
          <Dropdown
            name='clear'
            value={store.state.clear}
            onChange={(value) => store.set(value)}
            options={options}
          />
          <div style={{ height: '50px' }} />
          <Dropdown
            name='multi'
            label='Multiple dropdown'
            value={store.state.multi}
            multi
            onChange={(value) => store.set(value)}
            options={options}
          />
          <div style={{ height: '50px' }} />
          <div style={{ height: '50px' }} />
          <div style={{ height: '50px' }} />
        </div>
      );
    })(story)
  )));

