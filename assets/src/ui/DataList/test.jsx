import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const addAt = (list, index, item) => {
  const result = Array.from(list);
  result.splice(index, 0, item);
  return result;
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default class DataList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDragging: false,
      data: props.data
    }
    bindAll(this, 'onDragEnd', 'onDragStart');
  }

  componentWillReceiveProps({data}) {
    this.setState(() => ({data}));
  }

  onDragStart() {
    this.setState({
      isDragging: true
    });
  }

  onDragEnd({draggableId, type, destination, source, reason}) {
    if (!destination) return;


    if (parseInt(source.droppableId) === parseInt(destination.droppableId)) {
      if (source.droppableId.indexOf('inner') > -1 && destination.droppableId.indexOf('inner') > -1) {
        this.setState({
          isDragging: false,
          data: this.state.data.map((item) => {
            if (parseInt(destination.droppableId) === item.id) {
              return {...item, subdata: reorder(item.subdata, source.index, destination.index)}
            }
            return item;
          })
        });
      } else {
        this.setState({
          data: reorder(this.state.data, source.index, destination.index)
        });
      }
    } else {
      if (source.droppableId.indexOf('inner') > -1 && destination.droppableId.indexOf('inner') > -1) {
        const target = this.state.data.filter(({id}) => parseInt(source.droppableId) === id).map(({subdata}) => subdata[source.index]);
        this.setState({
          isDragging: false,
          data: this.state.data.map((item) => {
            if (parseInt(destination.droppableId) === item.id) {
              return {...item, subdata: addAt(item.subdata, destination.index, target[0])}
            } else if (parseInt(source.droppableId) === item.id) {
              item.subdata.splice(source.index, 1);
              return {...item, subdata: item.subdata};
            }
            return item;
          })
        });
      } else if (source.droppableId.indexOf('inner') > -1 && destination.droppableId.indexOf('inner-header') > -1) {
        const target = this.state.data.filter(({id}) => parseInt(source.droppableId) === id).map(({subdata}) => subdata[source.index]);
        this.setState({
          isDragging: false,
          data: this.state.data.map((item) => {
            if (parseInt(destination.droppableId) === item.id) {
              return {...item, subdata: addAt(item.subdata, 0, target[0])}
            } else if (parseInt(source.droppableId) === item.id) {
              item.subdata.splice(source.index, 1);
              return {...item, subdata: item.subdata};
            }
            return item;
          })
        });
      }
    }
    
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
          <Droppable droppableId='outer' type='outer'>
            {({innerRef, placeholder}, {isDraggingOver}) => (
              <ul ref={innerRef}>
                {data.map((item, i) => (
                  <Draggable key={item.id} draggableId={item.id} index={i} type='outer'>
                    {({innerRef, draggableProps, dragHandleProps}, draggableSnapshot) => (
                      <li key={item.id} ref={innerRef} {...draggableProps} {...dragHandleProps}>
                        <Droppable droppableId={`${item.id}-inner-header`} type='inner'>
                          {({innerRef, placeholder}, {isDraggingOver}) => (
                            <div ref={innerRef} style={{border: '1px solid black'}}>{item.data}</div>
                          )}
                        </Droppable>
                        {(item.subdata) ? (
                          <Droppable droppableId={`${item.id}-inner`} type='inner'>
                            {({innerRef, placeholder}, {isDraggingOver}) => (
                              <ul ref={innerRef}>
                                {item.subdata.map((item, i) => (
                                  <Draggable key={item.id} draggableId={item.id} index={i} type='inner'>
                                    {({innerRef, draggableProps, dragHandleProps}, draggableSnapshot) => (
                                      <li key={item.id} ref={innerRef} {...draggableProps} {...dragHandleProps}>
                                        {item.data}
                                      </li>
                                    )}
                                  </Draggable>
                                ))}
                                {placeholder}
                              </ul>
                            )}
                          </Droppable>
                        ) : null}
                      </li>
                    )}
                  </Draggable>
                ))}
                {placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}