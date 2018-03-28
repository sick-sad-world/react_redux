import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import Progress from './index';

storiesOf('UI Components', module)
  .addDecorator(withTests('Progress'))
  .add('Progress', withState({ radial: 0 }, (story, store) => (
    withInfo({
      propTables: [Progress]
    })(() => {
      const toggler = (name, amount = 5000) => () => {
        store.set({[name]: amount});
        setTimeout(() => store.set({[name]: 0}), amount)
      }
      return (
        <div style={{textAlign: 'center'}}>
          <button onClick={toggler('radial')}>Update radial</button>
          <Progress loading={!!store.state.radial} text='Uploading $p% ...'>
            <div>
              <h4>I am important content downloaded from elseware</h4>
              <button onClick={toggler('radial')}>Update me</button>
            </div>
          </Progress>
          <div style={{ height: '50px' }} />
        </div>
      )
    })(story)
  )));



