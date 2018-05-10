import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import { withTests } from 'with';
import DataList from './index';
import Row from './Row';
import data from './MOCK_DATA.json';

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
      id: 'name',
      size: '25%',
      
    }, {
      id: 'type',
      render: 'feedType',
      size: '90px'
    }, {
      id: 'url',
      size: '50%'
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

storiesOf('UI Components', module)
  .addDecorator(withTests('DataList'))
  .add('DataList', withInfo({
      propTables: [DataList, Row],
      propTablesExclude: [DataList]
    })(() => {
      return (
        <DataList config={config} data={data} />
      );
    }));

/**
 * <div>
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
 */