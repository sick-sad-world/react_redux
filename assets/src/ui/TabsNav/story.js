import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import TabsNav from './index';

storiesOf('Global Elements', module)
  .addDecorator(withTests('TabsNav'))
  .add('TabsNav', withState({state: 'one', store: 'one'}, (story, store) => (
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
              onChange={(value) => store.set({state: value})}
              active={store.state.state}
            />
            <div>
              Rendered tab: {store.state.state}
            </div>
          </div>
          <div style={{ height: '50px' }} />
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
          </BrowserRouter>
        </div>
      );
    })(story)
  )));

