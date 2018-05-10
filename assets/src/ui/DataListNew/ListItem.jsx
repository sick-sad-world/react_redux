import bindAll from 'lodash/bindAll';
import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { childrenShape } from 'shared/typings';

export default class ListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      subdata: false
    }
    bindAll(this, 'toggleSubdata');
  }

  toggleSubdata() {
    return this.setState(({subdata}) => ({subdata: !subdata}))
  }
  
  render() {
    const { children, Item, data, ...props } = this.props;
    return(
      <Draggable {...props}>
        {({innerRef, draggableProps, dragHandleProps}, draggableSnapshot) => (
          <li ref={innerRef} {...draggableProps}>
            <Item dragHandleProps={dragHandleProps} toggleSubdata={this.toggleSubdata} data={data} />
            {(children && this.state.subdata) && children}
          </li>
        )}
      </Draggable>
    );
  }
}

ListItem.propTypes = {
  data: PropTypes.object, // eslint-disable-line
  children: childrenShape,
  Item: PropTypes.func.isRequired,
}