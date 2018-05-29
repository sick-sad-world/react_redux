import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests, withState } from 'with';
import { action } from '@storybook/addon-actions';
import Assignment from './index';
import data from './MOCK_DATA.json'

function Item({type, name}) {
  return <div><b>{type}</b>: {name}</div>
}

storiesOf('UI Components', module)
  .addDecorator(withTests('Assignment'))
  .add('Assignment', withState({ chosen: [] }, (story, store) => (
    withInfo({
      propTables: [Assignment],
      propTablesExclude: [Item]
    })(() => (
      <Assignment
        selected={store.state.chosen}
        data={data}
        onChange={({selection}) => store.set({chosen: selection})}
        Item={Item}
        search='name'
      />
    ))(story)
  )));