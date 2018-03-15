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
      propTables: [Datepicker],
      propTablesExclude: [DateTime]
    })(() => {
      return (
        <div>
          <Datepicker
            name='simple'
            inputProps={{
              label: 'Simple Datetime input'
            }}
            onChange={(value) => store.set(value)}
            value={store.state.simple}
          />
        </div>
      );
    })(story)
  )));

