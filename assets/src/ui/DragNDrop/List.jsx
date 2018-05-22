import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { childrenShape, classNameShape } from 'shared/typings';

/** List that includes D&D functionality */
export default function List({children, className, ...props}) {
  return (
    <Droppable {...props}>
      {({innerRef, placeholder}, {isDraggingOver}) => (
        <ul className={className} ref={innerRef}>
          {children}
          {placeholder}
        </ul>
      )}
    </Droppable>
  )
}

List.propTypes = {
  /** Classes assigned to Rool element */
  className: classNameShape,
  /** Actual list to render */
  children: childrenShape.isRequired
}