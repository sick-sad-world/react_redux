import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { childrenShape } from 'shared/typings';

export default function List({children, ...props}) {
  return (
    <Droppable {...props}>
      {({innerRef, placeholder}, {isDraggingOver}) => (
        <ul classNames='data-list' ref={innerRef}>
          {children}
          {placeholder}
        </ul>
      )}
    </Droppable>
  )
}

List.propTypes = {
  children: childrenShape.isRequired
}