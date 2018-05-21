import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { childrenShape, classNameShape } from 'shared/typings';

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
  className: classNameShape,
  children: childrenShape.isRequired
}