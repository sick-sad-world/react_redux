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
            label='Simple checkbox'
            name='simple'
            onChange={() => store.set({simple: !store.state.simple})}
            checked={store.state.simple === true}
          />
          <div style={{ height: '50px' }} />
          <Checkbox
            label='Reversed layout checkbox'
            name='rev'
            reverse
            onChange={() => store.set({rev: !store.state.rev})}
            checked={store.state.rev === true}
          />
          <div style={{ height: '50px' }} />
          <Checkbox
            name='min'
            onChange={() => store.set({min: !store.state.min})}
            checked={store.state.min === true}
          />
          <div style={{ height: '50px' }} />
          <Checkbox
            label='With description'
            name='desc'
            onChange={() => store.set({desc: !store.state.desc})}
            checked={store.state.desc === true}
            descr='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, placeat.'
          />
          <div style={{ height: '50px' }} />
        </div>
      );
    })(story)
  )));

