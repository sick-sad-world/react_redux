import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import TextInput from './index';
import Raw from './component';
import IconButton from '../IconButton';

storiesOf('FormElements', module)
  .addDecorator(withTests('TextInput'))
  .add('TextInput', withState({ inv: 'some value' }, (story, store) => (
    withInfo({
      propTables: [Raw],
      propTablesExclude: [TextInput]
    })(() => {
      function onChange(value) {
        return store.set(value);
      }
      return (
        <div>
          <TextInput
            label='Simple input'
            name='simple'
            placeholder='enter your name'
            onChange={onChange}
            value={store.state.simple}
          />
          <div style={{ height: '50px' }} />
          <TextInput
            label='Simple input with description'
            name='descr'
            descr='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, placeat.'
            onChange={onChange}
            value={store.state.descr}
          />
          <div style={{ height: '50px' }} />
          <TextInput
            label='Disabled input'
            name='descr'
            disabled
            descr='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, placeat.'
            onChange={onChange}
            value={store.state.descr}
          />
          <div style={{ height: '50px' }} />
          <TextInput
            label='Simple invalid input'
            name='inv'
            valid={['some validation error']}
            pristine={false}
            validate={onChange}
            descr='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, placeat.'
            helper={<IconButton g='warning' viewBox='0 0 24 24' />}
            onChange={onChange}
            value={store.state.inv}
          />
          <div style={{ height: '50px' }} />
          <TextInput
            label='Simple input with prefix'
            name='prefix'
            prefix={<IconButton g='documents' />}
            onChange={onChange}
            value={store.state.prefix}
          />
          <div style={{ height: '50px' }} />
          <TextInput
            label='Simple input with suffix'
            name='suffix'
            suffix={<IconButton g='eye-with-line' />}
            onChange={onChange}
            value={store.state.suffix}
          />
        </div>
      );
    })(story)
  )));

