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
        <li style={style}><Button onClick={action('btn-click')} theme='raised' value='Button' /> - Simple raised button</li>
        <li style={style}><Button onClick={action('link-click')} theme='secondary-raised' el='link' value='Button' /> - Link as a button, Style secondary raised</li>
        <li style={style}><Button onClick={action('input-click')} theme='secondary' el='input' type='submit' value='Send' /> - [Input:submit] as a button, style secondary</li>
        <li style={style}><Button onClick={action('dis-click')} disabled value='Disabled' /> - Disabled button</li>
        <li style={style}>
          <Button onClick={action('loading-click')} theme='raised' value='Loading' /> - Loading indicator
        </li>
        <li style={style}>
          <Button theme='raised' onClick={action('sec-click')} prefix={<Icon g='globe' />} value='Button' /> - Icon before. Style Raised
        </li>
        <li style={style}><Button theme='error-raised' onClick={action('error-click')} value='error' /> - Raised button, Style error</li>
        <li style={style}><Button theme='warning' onClick={action('warning-click')} value='warning' /> - Simple button, Style warning</li>
        <li style={style}><Button theme='success-raised' onClick={action('success-click')} value='success' /> - Raised button, Style success</li>
        <li style={style}><Button theme='info' onClick={action('info-click')} value='info' /> - Simple button, Style info</li>
      </ol>
    ))
  );