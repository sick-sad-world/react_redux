import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import { childrenShape } from 'shared/typings';

/** Context for holding items that includes D&D functionality */
export default function Context({children, sortable, onDragStart, onDragUpdate, onDragEnd, ...props}) {
  if (sortable) {
    return (
      <DragDropContext {...props} onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
        {children}
      </DragDropContext>
    )
  }
  return children;
}

Context.defaultProps = {
  sortable: true
}

Context.propTypes = {
  /** Whatever D&D sorting is enabled */
  sortable: PropTypes.bool,
  /** Actual contents to render */
  children: childrenShape.isRequired,
  /** Hook running on Drag start  */
  onDragStart: PropTypes.func,
  /** Hook running on Drag update  */
  onDragUpdate: PropTypes.func,
  /** Hook running on Drag end  */
  onDragEnd: PropTypes.func
}