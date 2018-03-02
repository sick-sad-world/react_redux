import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withState } from '@dump247/storybook-state';
import withTests from 'withTests';
import Button from './index';
import Icon from '../Icon';


storiesOf('FormElements', module)
  .addDecorator(withTests('text-input'))
  .add('Button', withState({}, withInfo()(store => (
    <ol>
      <li><Button>Button</Button> - Simple button</li>
      <li><Button el='link'>Button</Button> - Link as a button</li>
      <li><Button el='input' type='submit' value='Send'/> - [Input:submit] as a button</li>
      <li><button disabled>Disabled</button> - Disabled button</li>
      <li>
        <Button>
          <Icon g='globe' />
          Button
        </Button>
        - Icon before
      </li>
      <li>
        <Button>Loading</Button>
        - Loading indicator
      </li>
      <li>
        <Button>
          Button
          <Icon g='trash' />
        </Button>
        - Icon After
      </li>
    </ol>
  ))));
