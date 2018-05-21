import { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import PageHeader from './index';

storiesOf('UI Components', module)
  .addDecorator(withTests('PageHeader'))
  .add('PageHeader', withState({}, (story, store) => (
    withInfo({
      propTables: [PageHeader]
    })(() => {
      return (
        <section>
          <PageHeader
            title='Some awesome page'
            subtitle='This page contains DataList'
            onChange={(cfg) => store.set(cfg)}
            sort={[
              {value: 'id', label:'By Id'}, 
              {value: 'name', label: 'By name'}, 
              {value: 'recipient', label: 'By recipient'}, 
              {value: 'group:column', label: 'Group By Column'}
            ]}
          />
        </section>
      )
    })(story)
  )));



