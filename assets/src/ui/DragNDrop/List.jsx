import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Droppable } from 'react-beautiful-dnd';
import { childrenShape, classNameShape, idShape } from 'shared/typings';

/** List that includes D&D functionality */
export default function List({children, className, sortable, droppableId, ...props}) {
  if (sortable) {
    return (
      <Droppable {...props} droppableId={droppableId}>
        {({innerRef, placeholder}, {isDraggingOver}) => (
          <ul className={cn(className, {'state--over': isDraggingOver})} ref={innerRef}>
            {children}
            {placeholder}
          </ul>
        )}
      </Droppable>
    )
  }
  return (
    <ul className={className} {...props}>{children}</ul>
  ) 
}

List.defaultProps = {
  sortable: true
}

List.propTypes = {
  /** Unique ID for droppable element */
  droppableId: idShape,
  /** Whatever D&D sorting is enabled */
  sortable: PropTypes.bool,
  /** Classes assigned to Rool element */
  className: classNameShape,
  /** Actual list to render */
  children: childrenShape.isRequired
}