import { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import Switcher from './index';
import Raw from './component';

storiesOf('FormElements', module)
  .addDecorator(withTests('Switcher'))
  .add('Switcher', withState({triple: null, simple: 0}, (story, store) => (
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
            options={[
              { label: 'Active', value: 1 },
              { label: 'Inactive', value: 0 }
            ]}
          />
          <div style={{ height: '24px' }} />
          <Switcher
            label='Triple switcher'
            name='triple'
            value={store.state.triple}
            onChange={(value) => store.set(value)}
            descr='Some desciption text'
            options={[
              { label: 'Only', value: 1 },
              { label: 'Include', value: null },
              { label: 'Omit', value: 0 }
            ]}
          />
          <div style={{ height: '24px' }} />
        </div>
      );
    })(story)
  )));

