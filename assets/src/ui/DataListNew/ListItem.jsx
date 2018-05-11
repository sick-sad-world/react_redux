import bindAll from 'lodash/bindAll';
import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';

export default class ListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      subdata: false
    }
    bindAll(this, 'toggleSubdata');
  }
  
  toggleSubdata() {
    return this.setState(({subdata}) => ({subdata: !subdata}));
  }

  render() {
    const { children, Item, data, hasSubList, ...props } = this.props;
    return (
      <Draggable {...props}>
        {({innerRef, draggableProps, dragHandleProps}, draggableSnapshot) => (
          <li ref={innerRef} {...draggableProps}>
            {(hasSubList) ? (
              <Item dragHandleProps={dragHandleProps} data={data} subdata={this.state.subdata} toggleSubdata={this.toggleSubdata} />
            ) : (
              <Item dragHandleProps={dragHandleProps} data={data} />
            )}
            {this.state.subdata && children}
          </li>
        )}
      </Draggable>
    );
  }
} 