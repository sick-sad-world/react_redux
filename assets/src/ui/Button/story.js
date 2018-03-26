import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import { withTests } from 'with';
import Button from './index';
import Icon from '../Icon';

const style = { marginBottom: '15px' }

storiesOf('FormElements', module)
  .addDecorator(withTests('Button'))
  .add(
    'Button',
    withInfo({
      propTablesExclude: [Icon]
    })(() => (
      <ol>
        <li style={style}><Button onClick={action('btn-click')}>Button</Button> - Simple button</li>
        <li style={style}><Button onClick={action('link-click')} theme='secondary-raised' el='link'>Button</Button> - Link as a button, Style secondary raised</li>
        <li style={style}><Button onClick={action('input-click')} theme='secondary' el='input' type='submit' value='Send' /> - [Input:submit] as a button, style secondary</li>
        <li style={style}><Button onClick={action('dis-click')} disabled>Disabled</Button> - Disabled button</li>
        <li style={style}>
          <Button onClick={action('loading-click')} theme='raised'>Loading</Button> - Loading indicator
        </li>
        <li style={style}>
          <Button mode='raised' onClick={action('icon-click')}>
            <span>Button</span>
            <Icon g='trash' />
          </Button> - Icon After, Style Raised
        </li>
        <li style={style}>
          <Button theme='raised' onClick={action('sec-click')}>
            <Icon g='globe' />
            <span>Button</span>
          </Button> - Icon before. Style Raised
        </li>
        <li style={style}><Button theme='error-raised' onClick={action('error-click')}>error</Button> - Raised button, Style error</li>
        <li style={style}><Button theme='warning' onClick={action('warning-click')}>warning</Button> - Simple button, Style warning</li>
        <li style={style}><Button theme='success-raised' onClick={action('success-click')}>success</Button> - Raised button, Style success</li>
        <li style={style}><Button theme='info' onClick={action('info-click')}>info</Button> - Simple button, Style info</li>
      </ol>
    ))
  );