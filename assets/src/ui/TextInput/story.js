import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import withTests from 'withTests';
import TextInput from './index';

class ElementStage extends React.Component {
    state = {
    };

  render(){
    return (
      <div>
        <TextInput
          label='Simple input'
          name='simple'
          value={this.state.simple}
          onChange={(value) => this.setState(value)}
        />
      </div>
    );
  }
}

storiesOf('FormElements', module)
  .addDecorator(withTests('text-input'))
  .add('TextInput', withInfo()(() => (<ElementStage/>)));