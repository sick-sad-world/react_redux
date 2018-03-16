import React from 'react';
import classNames from 'classnames';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withTests } from 'with';
import DataList from './index';

const config = [{
    id: 'name',
    label: 'Name',
    size: '35%'
  }, {
    id: 'email',
    label: 'Recipient',
    size: '20%'
  }, {
    id: 'active',
    label: 'Status',
    size: '10%',
    render(data) {
      const className = classNames({'success': data === 1, 'error': data === 0});
      return <samp className={className}>{data}</samp>
    }
  }, {
    id: 'columns',
    label: 'Columns',
    size: '35%',
    render(data) {
      return (
        <ul>
          {data.map(({name, id}) => (<li key={id}>{name}</li>))}
        </ul>
      );
    }
  }];

const data = [{
    active: 0,
    recipient: 'some@gmail.com',
    columns: [{id: 1, name: 'Column'}, {id: 2, name: 'Column 2'}, {id: 3, name: 'Column3'}],
    id: 69,
    name: "Alert Hearth",
  }, {
    active: 1,
    recipient: 'awesome@gmail.com',
    columns: [{id: 1, name: 'Column'}],
    id: 71,
    name: "Alert Awesome",
  }, {
    active: 1,
    recipient: 'last.day.of.earth@gmail.com',
    columns: [{id: 1, name: 'Column'}, {id: 2, name: 'Cool Column'}],
    id: 43,
    name: "Cool Alert",
  }];

const actions = [{

}];

storiesOf('FormElements', module)
  .addDecorator(withTests('TextInput'))
  .add('TextInput', withInfo({
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

