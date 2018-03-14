import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import Checkbox from './index';
import Raw from './component';

storiesOf('FormElements', module)
  .addDecorator(withTests('Checkbox'))
  .add('Checkbox', withState({}, (story, store) => (
    withInfo({
      propTables: [Raw],
      propTablesExclude: [Checkbox]
    })(() => {
      return (
        <div>
          <Checkbox
            label='Simple checkbox as number boolean'
            name='simple'
            numBool
            onChange={(v) => store.set(v)}
            checked={!!store.state.simple}
          />
          <div style={{ height: '24px' }} />
          <Checkbox
            name='min'
            onChange={(v) => store.set(v)}
            value='min'
            label='label'
            checked={!!(store.state.min && store.state.min.length)}
          />
          <div style={{ height: '24px' }} />
          <Checkbox
            label='With description'
            name='desc'
            onChange={(v) => store.set(v)}
            value
            checked={!!(store.state.desc && store.state.desc.length)}
            descr='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, placeat.'
          />
          <div style={{ height: '24px' }} />
        </div>
      );
    })(story)
  )));

