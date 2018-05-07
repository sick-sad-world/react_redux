import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import { withTests } from 'with';
import DataList from './index';
import DataListRow from './row';

const config = {
  columns: [{
    id: 'image',
    label: '',
    render: 'image',
    rounded: true,
    size: '32px'
  }, {
    id: 'name',
    label: 'Name',
    size: '30%'
  }, {
    id: 'recipient',
    label: 'Recipient',
    def: 'No recipient specified',
    size: '30%'
  }, {
    id: 'active',
    label: 'Status',
    render: 'status',
    size: '90px',
  }, {
    id: 'columns',
    label: 'Columns',
    size: '40%',
    render: 'list'
  }],
  actions: (item) => {
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
  },
  subdata: {
    columns: [{
      id: 'id',
      size: '32px'
    }, {
      id: 'label',
      size: '50%'
    }, {
      id: 'descr',
      size: '50%'
    }, {
      id: 'type',
      render: 'feedType',
      size: '90px'
    }],
    actions: (item) => {
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
  }
};

const data = [{
    active: 0,
    recipient: 'some@gmail.com',
    image: {src:'https://picsum.photos/200', alt: 'Some image'},
    columns: [{id: 1, label: 'Column'}, {id: 2, label: 'Column 2'}, {id: 3, label: 'Column 3'}],
    id: 69,
    name: "Report Hearth",
    subdata: [{
      id: 1,
      label: 'Column',
      descr: 'Awesome column',
      type: 'html'
    }, {
      id: 2,
      label: 'Column 2',
      descr: 'Awesome column',
      type: 'rss'
    }, {
      id: 3,
      label: 'Column 3',
      descr: 'Awesome column',
      type: 'twitter'
    }]
  }, {
    active: 1,
    recipient: 'awesome@gmail.com',
    image: {src:'https://picsum.photos/20013123', alt: 'Ihor Koptielov'},
    columns: [{id: 1, label: 'Column'}],
    id: 71,
    name: "Report Awesome",
    subdata: [{
      id: 1,
      label: 'Column',
      descr: 'Awesome column',
      type: 'facebook'
    }]
  }, {
    active: 1,
    recipient: 'last.day.of.earth@gmail.com',
    image: {src:'https://picsum.photos/200', alt: 'Some image'},
    columns: [{id: 1, label: 'Column'}, {id: 2, label: 'Cool Column'}],
    id: 43,
    name: "Cool Report",
    subdata: [{
      id: 1,
      label: 'Column',
      descr: 'Awesome column',
      type: 'html'
    }, {
      id: 2,
      label: 'Cool Column',
      descr: 'Cool column',
      type: 'rss'
    }]
  }, {
    active: 1,
    recipient: null,
    image: {src:'https://picsum.photos/200', alt: 'Some image'},
    columns: [{id: 2, label: 'Important Column'}],
    id: 12,
    name: "Recipeless Report",
    subdata: [{
      id: 2,
      label: 'Important Column',
      descr: 'Important column',
      type: 'reddit'
    }]
  }];

storiesOf('UI Components', module)
  .addDecorator(withTests('DataList'))
  .add('DataList', withInfo({
      propTables: [DataList, DataListRow],
      propTablesExclude: [DataList]
    })(() => {
      return (
        <div>
          <h4>Regular list</h4>
          <DataList
            config={config}
            data={data}
            sortable
          />
          <div style={{height: '50px'}} />
          <h4>Empty list</h4>
          <DataList
            config={config}
            data={[]}
            sortable
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
          />
        </div>
      );
    }));