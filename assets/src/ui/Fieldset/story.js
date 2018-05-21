import { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import Fieldset from './index';
import FormField from '../FormField';
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
      propTablesExclude: [TextInput, Dropdown, Button, FormField]
    })(() => {
      return (
        <form>
          <Fieldset title='Add custom filter' collapsable>
            <TextInput label='Text' name='text' value={store.state.text} onChange={(value) => store.set(value)} />
            <br />
            <Dropdown label='Prefix' name='prefix' value={store.state.prefix} onChange={(value) => store.set(value)} options={prefix} />
            <br />
            <Dropdown label='Suffix' name='suffix' value={store.state.suffix} onChange={(value) => store.set(value)} options={suffix} />
            <br />
            <Button theme='raised' value='Add' />
          </Fieldset>
          <br />
          <Fieldset title='Just plain always open one'>
            <TextInput label='Text' name='text' value={store.state.text} onChange={(value) => store.set(value)} />
            <br />
            <Button theme='raised' value='Add' />
          </Fieldset>
          <br />
          <Fieldset title='Error in fieldset' collapsable error={['Field should not be empty', 'Value must be a valid email']}>
            <TextInput label='Text' name='text' value={store.state.text} onChange={(value) => store.set(value)} />
            <br />
            <Button theme='raised' value='Add' />
          </Fieldset>
        </form>
      );
    })(story)
  )));

