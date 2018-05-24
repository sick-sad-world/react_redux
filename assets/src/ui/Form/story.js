import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests } from 'with';
import { action } from '@storybook/addon-actions';
import Form from './index';
import TextInput from '../TextInput';
import Dropdown from '../Dropdown';
import RadioButton from '../RadioButton';
import Button from '../Button';

storiesOf('FormElements', module)
  .addDecorator(withTests('FormField'))
  .add('Form', withInfo({
    propTables: [Form]
  })(() => (
    <Form onSubmit={action('Submit')} values={{radio: 1, dropdown: 'one', text: 'text'}}>
      {({values, bindInput, valid}) => (
        <React.Fragment>
          <TextInput {...bindInput('text')} label='Text field' rules={['required']} />
          <br />
          <Dropdown
            label='Simple dropdown'
            options={[
              { value: 'one', label: 'Digit One' },
              { value: 'two', label: 'Two' },
              { value: 'three', label: 'Three porks' },
              { value: 'four', label: 'Four' },
              { value: 'five', label: 'Five house of cards' },
              { value: 'six', label: 'Six sex' }
            ]}
            {...bindInput('dropdown')}
          />
          <br />
          <div>
            <RadioButton
              label='Radio 1'
              {...bindInput('radio')}
              value={1}
              checked={values.radio === 1}
            />
            <RadioButton
              label='Radio 2'
              {...bindInput('radio')}
              value={2}
              checked={values.radio === 2}
            />
            <RadioButton
              label='Radio 3'
              {...bindInput('radio')}
              value={3}
              checked={values.radio === 3}
            />
          </div>
          <br />
          <Button value='submit' disabled={!valid} />
        </React.Fragment>
      )}
    </Form>
  )));
