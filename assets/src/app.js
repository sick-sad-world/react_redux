import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import DataList from './ui/DataList';
import data from './ui/DataList/MOCK_DATA.json';

import 'normalize.css';
import '../sass/app.scss';

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
      label: 'Disable',
      icon: 'eye-with-line',
      handler: console.log
    } : {
      label: 'Enable',
      icon: 'eye',
      handler: console.log
    }

    return [changeState, {
      label: 'Create feed here',
      icon: 'add-to-list',
      handler: console.log
    }, {
      label: 'Edit',
      icon: 'documents',
      handler: console.log
    }, '---', {
      label: 'Delete',
      icon: 'trash',
      handler: console.log
    }]
  },
  subdata: {
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
      label: 'Add to set',
      icon: 'add-to-list',
      handler: console.log
    }, {
      label: 'Remove from set',
      icon: 'trash',
      handler: console.log
    }]
  }
};

render(
  (
    <div>
      <DataList config={config} data={data} onSort={console.log} />
    </div>
  ),
  document.getElementById('root')
);
