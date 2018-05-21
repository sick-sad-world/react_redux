import { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import RadioButton from './index';
import Raw from './component';

storiesOf('FormElements', module)
  .addDecorator(withTests('RadioButton'))
  .add('RadioButton', withState({}, (story, store) => (
    withInfo({
      propTables: [Raw],
      propTablesExclude: [RadioButton]
    })(() => {
      return (
        <div>
          <RadioButton
            label='Simple radio'
            name='name'
            value='simple'
            onChange={(value) => store.set(value)}
            checked={store.state.name === 'simple'}
          />
          <div style={{ height: '24px' }} />
          <RadioButton
            name='name'
            value='min'
            label='label'
            onChange={(value) => store.set(value)}
            checked={store.state.name === 'min'}
          />
          <div style={{ height: '24px' }} />
          <RadioButton
            name='name'
            value='dis'
            disabled
            label='Disablaed'
            onChange={(value) => store.set(value)}
            checked={store.state.name === 'dis'}
          />
          <div style={{ height: '24px' }} />
          <RadioButton
            label='With description'
            name='name'
            value='desc'
            onChange={(value) => store.set(value)}
            checked={store.state.name === 'desc'}
            descr='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, placeat.'
          />
          <div style={{ height: '24px' }} />
        </div>
      );
    })(story)
  )));

