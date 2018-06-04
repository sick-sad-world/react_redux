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
    id: 'id',
    label: 'id',
    size: '32px',
    className: 'enum'
  }, {
    id: 'name',
    label: 'Name',
    size: '30%'
  }, {
    id: 'status',
    label: 'Status',
    render: 'status',
    size: '90px',
  }, {
    id: 'owner',
    label: 'Owner',
    def: 'Owner not found',
    size: '30%'
  }],
  actions: (item) => {
    const changeState = (item.status) ? {
      key: 'dis',
      label: 'Disable',
      icon: 'eye-with-line',
      handler: action('Disable')
    } : {
      key: 'enb',
      label: 'Enable',
      icon: 'eye',
      handler: action('Enable')
    }

    return [changeState, {
      key: 'create',
      label: 'Create feed here',
      icon: 'add-to-list',
      handler: action('Create feed here')
    }, {
      key: 'edit',
      label: 'Edit',
      icon: 'documents',
      handler: action('Edit')
    }, {
      key: 'sep'
    }, {
      key: 'delete',
      label: 'Delete',
      icon: 'trash',
      handler: action('Delete')
    }]
  }
};

const subconfig = {
  emptyText: 'This set is empty. Add some feeds.',
  columns: [{
    id: 'id',
    size: '32px'
  }, {
    id: 'type',
    render: 'feedType',
    size: '90px'
  }, {
    id: 'name',
    size: '25%',
  }, {
    id: 'url',
    size: '50%'
  }],
  actions: [{
    key: 'add',
    label: 'Add to set',
    icon: 'add-to-list',
    handler: action('Add to set')
  }, {
    key: 'remove',
    label: 'Remove from set',
    icon: 'trash',
    handler: action('Remove from set')
  }]
};

storiesOf('UI Components', module)
  .addDecorator(withTests('DataList'))
  .add('DataList', withInfo({
      propTables: [DataList, Row],
      propTablesExclude: [DataList]
    })(() => {
      return (
        <div>
          <h4>Regular list</h4>
          <DataList config={config} subconfig={subconfig} sortable='both' data={data} onSort={action('onSort')} />
          <div style={{height: '50px'}} />
          <h4>Empty list</h4>
          <DataList
            config={config}
            data={[]}
            onSort={action('onSort')}
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
            onSort={action('onSort')}
            loading={false}
          />
        </div>
      );
    }));