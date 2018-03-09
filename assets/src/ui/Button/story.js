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
        <li style={{ marginBottom: '5px' }}><Button mode='solid' onClick={action('btn-click')}>Button</Button> - Simple button</li>
        <li style={{ marginBottom: '5px' }}><Button onClick={action('link-click')}  theme='secondary' mode='lined' el='link'>Button</Button> - Link as a button</li>
        <li style={{ marginBottom: '5px' }}><Button onClick={action('input-click')} el='input' type='submit' value='Send' /> - [Input:submit] as a button</li>
        <li style={{ marginBottom: '5px' }}><Button onClick={action('dis-click')} mode='solid' disabled>Disabled</Button> - Disabled button</li>
        <li style={{ marginBottom: '5px' }}>
          <Button mode='solid' onClick={action('loading-click')}>Loading</Button> - Loading indicator
        </li>
        <li style={{ marginBottom: '5px' }}>
          <Button mode='lined' onClick={action('icon-click')}>
            <span>Button</span>
            <Icon g='trash' />
          </Button> - Icon After
        </li>
        <li style={{ marginBottom: '5px' }}>
          <Button mode='solid' theme='secondary' onClick={action('sec-click')}>
            <Icon g='globe' />
            <span>Button</span>
          </Button> - Icon before. Style accent secondary
        </li>
        <li style={{ marginBottom: '5px' }}><Button mode='solid' onClick={action('error-click')} theme='error'>error</Button> - Simple button</li>
        <li style={{ marginBottom: '5px' }}><Button mode='lined' onClick={action('warning-click')} theme='warning'>warning</Button> - Simple button</li>
        <li style={{ marginBottom: '5px' }}><Button mode='solid' onClick={action('success-click')} theme='success'>success</Button> - Simple button</li>
        <li style={{ marginBottom: '5px' }}><Button mode='lined' onClick={action('info-click')} theme='info'>info</Button> - Simple button</li>
      </ol>
    ))
  );
