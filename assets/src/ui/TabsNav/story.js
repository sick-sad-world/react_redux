import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import TabsNav from './index';

storiesOf('UI Components', module)
  .addDecorator(withTests('TabsNav'))
  .add('TabsNav', withState({three: 'one', four: 'one'}, (story, store) => (
    withInfo({
      propTables: [TabsNav],
      propTablesExclude: [BrowserRouter]
    })(() => {
      return (
        <div>
          <div>
            <TabsNav
              options={{
                'one': 'First tab',
                'two': 'Second tab',
                'three': 'Third tab'
              }}
              onChange={(value) => store.set({three: value})}
              active={store.state.three}
            />
            <div>
              Rendered tab: {store.state.three}
            </div>
          </div>
          <div>
            <TabsNav
              options={{
                'one': 'First tab',
                'two': 'Second tab',
                'three': 'Third tab',
                'four': 'Four tab'
              }}
              onChange={(value) => store.set({four: value})}
              active={store.state.four}
            />
            <div>
              Rendered tab: {store.state.four}
            </div>
          </div>
          {/* <div style={{ height: '50px' }} />
          <BrowserRouter>
            <div>
              <TabsNav
                options={{
                  '/one': 'First route',
                  '/two': 'Second route',
                  '/three': 'Third route'
                }}
              />
              <Switch>
                <Route path="/one" component={() => <span>one</span>} />
                <Route path="/two" component={() => <span>two</span>} />
                <Route path="/three" component={() => <span>three</span>} />
              </Switch>
            </div>
              </BrowserRouter>*/}
        </div>
      );
    })(story)
  )));

