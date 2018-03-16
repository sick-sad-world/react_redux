import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests } from 'with';
import DataList from './index';



const config = [{
    id: 'name',
    label: 'Name',
    size: '25%'
  }, {
    id: 'recipient',
    label: 'Recipient',
    def: 'No recipient specified',
    size: '30%'
  }, {
    id: 'active',
    label: 'Status',
    render: 'status'
  }, {
    id: 'columns',
    label: 'Columns',
    size: '30%',
    render: 'list'
  }];

const data = [{
    active: 0,
    recipient: 'some@gmail.com',
    columns: [{id: 1, label: 'Column'}, {id: 2, label: 'Column 2'}, {id: 3, label: 'Column3'}],
    id: 69,
    name: "Report Hearth",
  }, {
    active: 1,
    recipient: 'awesome@gmail.com',
    columns: [{id: 1, label: 'Column'}],
    id: 71,
    name: "Report Awesome",
  }, {
    active: 1,
    recipient: 'last.day.of.earth@gmail.com',
    columns: [{id: 1, label: 'Column'}, {id: 2, label: 'Cool Column'}],
    id: 43,
    name: "Cool Report",
  }, {
    active: 1,
    recipient: null,
    columns: [{id: 2, label: 'Important Column'}],
    id: 12,
    name: "Recipeless Report",
  }];

const actions = [{

}];

storiesOf('UI Components', module)
  .addDecorator(withTests('DataList'))
  .add('DataList', withInfo({
      propTables: [DataList],
      propTablesExclude: []
    })(() => {
      return (
        <div>
          <DataList
            config={config}
            data={data}
            sortable
            loading={false}
            actions={actions}
          />
        </div>
      );
    }));

