import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function ListHeader() {
  return <div></div>
}

function List({ children, ...props }) {
  return (
    <Droppable {...props}>
      {({ innerRef, droppableProps, placeholder }, { isDraggingOver, draggingOverWith }) => (
        <ul ref={innerRef} {...droppableProps} className={classNames({'state--over': isDraggingOver})}>
          {children}
          {placeholder}
        </ul>
      )}
    </Droppable>
  )
}

function ItemWrapper({children, droppable, ...props}) {
  return (
    <Draggable {...props}>
      {({ draggableProps, dragHandleProps, innerRef }, { isDragging }) => (
        <li>
          {(droppable) ? <Droppable {...droppable}>{children}</Droppable> : children}
        </li>
      )}
    </Draggable>
  );
}

function Item() {
  return (
    <li>
      <div>
        // Content
      </div>
    </li>
  );
}

export default class DataList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  render() {
    const {data} = this.state;
    return (
      <div>
        <ListHeader />
        <DragDropContext>
          <List droppableId='outer-list' type='outer'>
            {data.map((item, i) => (
              <Draggable key={item.id} index={i} draggable={`outer-${item.id}`}>
                {({ draggableProps, dragHandleProps, innerRef }, { isDragging }) => (
                  <Item ref={innerRef} {...draggableProps} {...dragHandleProps} data={item}>
                    {item.subdata && (
                      <List droppableId={`inner-list-${item.id}`}>
                        {item.subdata.map((sub, i) => (
                          <ItemWrapper key={sub.id} index={i} draggable={`outer-${sub.id}`}>
                          </ItemWrapper>
                          <Draggable>
                            {({ draggableProps, dragHandleProps, innerRef }, { isDragging }) => (
                              <Item data={sub} />
                            )}
                          </Draggable>
                        ))}
                      </List>
                    )}
                  </Item>
                )}
              </Draggable>
            ))}
          </List>
        </DragDropContext>
      </div>
    );
  }
}