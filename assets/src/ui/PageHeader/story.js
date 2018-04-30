import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import PageHeader from './index';

storiesOf('UI Components', module)
  .addDecorator(withTests('PageHeader'))
  .add('PageHeader', withState({ search: '', sort: 'id', create: true }, (story, store) => (
    withInfo({
      propTables: [PageHeader]
    })(() => {
      return (
        <section>
          <PageHeader
            title='Some awesome page'
            subtitle='This page contains DataList'
            search={{
              value: store.state.search,
              onChange: (value) => store.set(value)
            }}
            sort={{
              options: [{value: 'id', label:'By Id'}, {value: 'name', label: 'By name'}, {value: 'recipient', label: 'By recipient'}],
              value: store.state.sort,
              onChange: (value) => store.set(value)
            }}
          />
        </section>
      )
    })(story)
  )));



