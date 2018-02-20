import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import 'normalize.css';
import TextInput from 'ui/TextInput';
import Icon from 'ui/Icon';
import '../sass/app.scss';

render(
  (
    <div>
      <form style={{ width: '400px', margin: '16px' }}>
        <div className='row'>
          <TextInput
            value=''
            name='text'
            label='Some label'
            placeholder='Enter your text here'
            descr='Lorem ipsum dolor sit amet consectetur adipisicing elit.'
            validate={console.log}
            onChange={console.log}
            prefix={<Icon icon='archive'/>}
            suffix={<Icon icon='cone'/>}
          />
        </div>
      </form>
    </div>
  ),
  document.getElementById('root')
);
