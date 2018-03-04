import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withState } from '@dump247/storybook-state';
import withTests from 'withTests';
import TextInput from './index';
import Icon from '../Icon';

storiesOf('FormElements', module)
  .addDecorator(withTests('text-input'))
  .add('TextInput', story =>
    withState({ inv: 'some value' }, store => withInfo()(() => (
      <div>
        <TextInput
          label='Simple input'
          name='simple'
          placeholder='enter your name'
          onChange={value => store.set(value)}
          value={store.state.simple}
        />
        <div style={{ height: '50px' }} />
        <TextInput
          label='Simple input with description'
          name='descr'
          descr='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, placeat.'
          onChange={value => store.set(value)}
          value={store.state.descr}
        />
        <div style={{ height: '50px' }} />
        <TextInput
          label='Simple invalid input'
          name='inv'
          valid={['some validation error']}
          pristine={false}
          descr='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, placeat.'
          suffix={<Icon g='warning' />}
          onChange={value => store.set(value)}
          value={store.state.inv}
        />
        <div style={{ height: '50px' }} />
        <TextInput
          label='Simple input with prefix'
          name='prefix'
          prefix={<Icon g='documents' />}
          onChange={value => store.set(value)}
          value={store.state.prefix}
        />
        <div style={{ height: '50px' }} />
        <TextInput
          label='Simple input with suffix'
          name='suffix'
          suffix={<Icon g='eye-with-line' />}
          onChange={value => store.set(value)}
          value={store.state.suffix}
        />
      </div>
    ))(story))());
