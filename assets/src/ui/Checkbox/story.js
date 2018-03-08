import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import Checkbox from './index';
import Raw from './component';
import Icon from '../Icon';

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
            value
            onChange={({simple}) => store.set({simple: !simple})}
            checked={store.state.simple === true}
          />
          <div style={{ height: '50px' }} />
          <Checkbox
            name='min'
            value
            onChange={({min}) => store.set({min: !min})}
            checked={store.state.min === true}
          />
          <div style={{ height: '50px' }} />
          <Checkbox
            label='With description'
            name='desc'
            value
            onChange={({desc}) => store.set({desc: !desc})}
            checked={store.state.desc === true}
            descr='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, placeat.'
          />
          <div style={{ height: '50px' }} />
        </div>
      );
    })(story)
  )));

