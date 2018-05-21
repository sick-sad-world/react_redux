import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import Dropdown from './index';
import Raw from './component';
import IconButton from '../IconButton';

const options = [
  { value: 'one', label: 'Digit One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three porks' },
  { value: 'four', label: 'Four' },
  { value: 'five', label: 'Five house of cards' },
  { value: 'six', label: 'Six sex' }
];

function loadOptions() {
  return new Promise((res) => {
    setTimeout(res, 5000, options)
  }) 
}

storiesOf('FormElements', module)
  .addDecorator(withTests('Dropdown'))
  .add('Dropdown', withState({inv: 'two'}, (story, store) => (
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
            prefix={<IconButton g='cone' />}
          />
          <div style={{ height: '50px' }} />
          <Dropdown
            name='clear'
            label='Async Dropdown'
            loadingPlaceholder='Loading some columns'
            loadOptions={loadOptions}
            value={store.state.clear}
            onChange={(value) => store.set(value)}
            descr='This dropdown values are loaded from remote'
            suffix={<IconButton g='bar-graph' />}
          />
          <div style={{ height: '50px' }} />
          <Dropdown
            name='multi'
            label='Multiple dropdown'
            value={store.state.multi}
            multi
            closeOnSelect={false}
            onChange={(value) => store.set(value)}
            options={options}
            descr='This dropdown allows you to select multiple items'
          />
          <div style={{ height: '50px' }} />
          <Dropdown
            name='create'
            label='Creatable Dropdown'
            creatable
            onNewOptionClick={(opt) => {
              console.log(opt);
              return opt;
            }}
            value={store.state.create}
            options={options}
            onChange={(value) => store.set(value)}
          />
          <div style={{ height: '50px' }} />
          <Dropdown
            name='inv'
            label='Invalid dropdown'
            valid={['some validation error']}
            pristine={false}
            validate={() => false}
            value={store.state.inv}
            onChange={(value) => store.set(value)}
            options={options}
          />
          <div style={{ height: '50px' }} />
        </div>
      );
    })(story)
  )));

