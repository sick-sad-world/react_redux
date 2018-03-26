import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import Fieldset from './index';
import TextInput from '../TextInput';

storiesOf('FormElements', module)
  .addDecorator(withTests('Fieldset'))
  .add('Fieldset', withState({}, (story, store) => (
    withInfo({
      propTables: [Fieldset],
      propTablesExclude: [TextInput]
    })(() => {
      function onChange(value) {
        return store.set(value);
      }
      return (
        <div>
        </div>
      );
    })(story)
  )));

