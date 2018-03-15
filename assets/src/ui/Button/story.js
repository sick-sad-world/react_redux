import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import { withTests } from 'with';
import Button from './index';
import Icon from '../Icon';


storiesOf('FormElements', module)
  .addDecorator(withTests('Button'))
  .add(
    'Button',
    withInfo({
      propTablesExclude: [Icon]
    })(() => (
      <ol>
        <li style={{ marginBottom: '15px' }}><Button onClick={action('btn-click')}>Button</Button> - Simple button</li>
        <li style={{ marginBottom: '15px' }}><Button onClick={action('link-click')} theme='secondary-raised' el='link'>Button</Button> - Link as a button, Style secondary raised</li>
        <li style={{ marginBottom: '15px' }}><Button onClick={action('input-click')} theme='secondary' el='input' type='submit' value='Send' /> - [Input:submit] as a button, style secondary</li>
        <li style={{ marginBottom: '15px' }}><Button onClick={action('dis-click')} disabled>Disabled</Button> - Disabled button</li>
        <li style={{ marginBottom: '15px' }}>
          <Button onClick={action('loading-click')} theme='raised'>Loading</Button> - Loading indicator
        </li>
        <li style={{ marginBottom: '15px' }}>
          <Button mode='raised' onClick={action('icon-click')}>
            <span>Button</span>
            <Icon g='trash' />
          </Button> - Icon After
        </li>
        <li style={{ marginBottom: '15px' }}>
          <Button theme='raised' onClick={action('sec-click')}>
            <Icon g='globe' />
            <span>Button</span>
          </Button> - Icon before. Style accent secondary
        </li>
        <li style={{ marginBottom: '15px' }}><Button theme='error-raised' onClick={action('error-click')}>error</Button> - Simple button, Style error</li>
        <li style={{ marginBottom: '15px' }}><Button theme='warning' onClick={action('warning-click')}>warning</Button> - Simple button, Style warning</li>
        <li style={{ marginBottom: '15px' }}><Button theme='success-raised' onClick={action('success-click')}>success</Button> - Simple button, Style success</li>
        <li style={{ marginBottom: '15px' }}><Button theme='info' onClick={action('info-click')}>info</Button> - Simple button, Style info</li>
      </ol>
    ))
  );
