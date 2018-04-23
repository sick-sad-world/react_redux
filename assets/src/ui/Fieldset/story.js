import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import Fieldset from './index';
import TextInput from '../TextInput';
import Dropdown from '../Dropdown';
import Button from '../Button';

const prefix = [{value: 'min', label: 'min'}, {value: 'max', label: 'max'}];
const suffix = [{value: 'likes', label: 'likes'}, {value: 'shares', label: 'shares'}, {value: 'comments', label: 'comments'}, {value: 'max', label: 'max'}];

storiesOf('FormElements', module)
  .addDecorator(withTests('Fieldset'))
  .add('Fieldset', withState({text: '', prefix: '', suffix: ''}, (story, store) => (
    withInfo({
      propTables: [Fieldset],
      propTablesExclude: [TextInput, Dropdown]
    })(() => {
      return (
        <form>
          <Fieldset title='Add custom filter'>
            <TextInput label='Text' name='text' value={store.state.text} onChange={(value) => store.set(value)} />
            <br />
            <Dropdown label='Prefix' name='prefix' value={store.state.prefix} onChange={(value) => store.set(value)} options={prefix} />
            <br />
            <Dropdown label='Suffix' name='suffix' value={store.state.suffix} onChange={(value) => store.set(value)} options={suffix} />
            <br />
            <Button theme='raised' value='Add' />
          </Fieldset>
        </form>
      );
    })(story)
  )));

