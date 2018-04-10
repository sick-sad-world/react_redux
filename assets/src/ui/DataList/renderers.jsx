import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Badge from '../Badge';

const statusValues = {
  1: ['success', 'Active'],
  0: ['error', 'Inactive']
}

function StatusRenderer(data) {
  return <Badge className={classNames(statusValues[data][0], 'status')}>{statusValues[data][1]}</Badge>
}

function ListRenderer(data, def) {
  return (
    <ul className='small-list'>
      {data.length ? data.map(({label, id}) => (<li key={id}>{label}</li>)) : <li className='state--empty'>{def}</li>}
    </ul>
  );
}

function RenderDefault(data, def = 'not found') {
  return (
    <span>{(data === null || data === undefined || data === '') ? def : data }</span>
  )
}

export default {
  status: StatusRenderer,
  list: ListRenderer,
  renderDefault: RenderDefault
}