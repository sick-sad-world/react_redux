import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import { withTests } from 'with';
import DataList from './index';
import DataListRow from './row';



const config = [{
    id: 'image',
    label: 'Image',
    render: 'image',
    rounded: true,
    size: '32px'
  }, {
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
    image: {src:'https://picsum.photos/200', alt: 'Some image'},
    columns: [{id: 1, label: 'Column'}, {id: 2, label: 'Column 2'}, {id: 3, label: 'Column3'}],
    id: 69,
    name: "Report Hearth",
  }, {
    active: 1,
    recipient: 'awesome@gmail.com',
    image: {src:'https://picsum.photos/200', alt: 'Some image'},
    columns: [{id: 1, label: 'Column'}],
    id: 71,
    name: "Report Awesome",
  }, {
    active: 1,
    recipient: 'last.day.of.earth@gmail.com',
    image: {src:'https://picsum.photos/200', alt: 'Some image'},
    columns: [{id: 1, label: 'Column'}, {id: 2, label: 'Cool Column'}],
    id: 43,
    name: "Cool Report",
  }, {
    active: 1,
    recipient: null,
    image: {src:'https://picsum.photos/200', alt: 'Some image'},
    columns: [{id: 2, label: 'Important Column'}],
    id: 12,
    name: "Recipeless Report",
  }];

const actions = (item) => {
  const changeState = (item.active) ? {
    label: 'Disable',
    icon: 'eye-with-line',
    handler: action('Disable')
  } : {
    label: 'Enable',
    icon: 'eye',
    handler: action('Enable')
  }

  return [changeState, {
    label: 'Edit',
    icon: 'documents',
    handler: action('Edit')
  }, '---', {
    label: 'Delete',
    icon: 'trash',
    handler: action('Delete')
  }]
}

storiesOf('UI Components', module)
  .addDecorator(withTests('DataList'))
  .add('DataList', withInfo({
      propTables: [DataList, DataListRow],
      propTablesExclude: []
    })(() => {
      return (
        <div>
          <h4>Regular list</h4>
          <DataList
            config={config}
            data={data}
            sortable
            actions={actions}
          />
          <div style={{height: '50px'}} />
          <h4>Empty list</h4>
          <DataList
            config={config}
            data={[]}
            sortable
            actions={actions}
          />
          <div style={{height: '50px'}} />
          <h4>Errored list</h4>
          <DataList
            config={config}
            errorState={{
              title: 'Some error happened',
              text: 'Error 500: General back-end error'
            }}
            data={[]}
            sortable
            loading={false}
            actions={actions}
          />
        </div>
      );
    }));