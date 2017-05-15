import React from 'react';
import PropTypes from 'prop-types';
import Icon from './icon';
import { SortableHandle } from 'react-sortable-hoc';

function DragHandle() {
  return <span className='drag-handle'><Icon icon='dots-three-vertical' /></span>;
}

export default SortableHandle(DragHandle);
