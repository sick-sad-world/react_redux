import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import Datepicker from './index';
import DateTime from 'react-datetime';

storiesOf('FormElements', module)
  .addDecorator(withTests('TextInput'))
  .add('Datepicker', withState({ simple: '' }, (story, store) => (
    withInfo({
      propTables: [DateTime],
      propTablesExclude: [Datepicker]
    })(() => {
      function onChange(value) {
        return store.set(value);
      }
      return (
        <div>
          <Datepicker
            inputProps={{
              label: 'Simple Datetime input',
              name: 'simple'
            }}
            onChange={onChange}
            value={store.state.simple}
          />
        </div>
      );
    })(story)
  )));

