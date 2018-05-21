import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import Progress from './index';

storiesOf('UI Components', module)
  .addDecorator(withTests('Progress'))
  .add('Progress', withState({ radial: false }, (story, store) => (
    withInfo({
      propTables: [Progress]
    })(() => {
      return (
        <div style={{textAlign: 'center'}}>
          <button onClick={() => {
            store.set({radial: true})
            setTimeout(() => {
              store.set({radial: false})
            }, 100);
          }}
          >flash radial
          </button>
          <button onClick={() => store.set({radial: true})}>Update radial</button>
          <button onClick={() => store.set({radial: false})}>Cancel radial</button>
          <Progress loading={!!store.state.radial} text='Uploading $p% ...'>
            <div>
              <h4>I am important content downloaded from elseware</h4>
              <button onClick={() => store.set({radial: true})}>Update me</button>
            </div>
          </Progress>
          <div style={{ height: '50px' }} />
          <button onClick={() => {
            store.set({linear: true})
            setTimeout(() => {
              store.set({linear: false})
            }, 100);
          }}
          >flash linear
          </button>
          <button onClick={() => store.set({linear: true})}>Update linear</button>
          <button onClick={() => store.set({linear: false})}>Cancel linear</button>
          <Progress type='linear' loading={!!store.state.linear} text='Uploading $p% ...'>
            <div>
              <h4>I am important content downloaded from elseware</h4>
              <button onClick={() => store.set({linear: true})}>Update me</button>
            </div>
          </Progress>
        </div>
      )
    })(story)
  )));



