import bindAll from 'lodash/bindAll';
import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { childrenShape } from 'shared/typings';

/** ListItem that wraps D&D functionality and subdata rendering */
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
              <Item draggableSnapshot={draggableSnapshot} dragHandleProps={dragHandleProps} data={data} subdata={this.state.subdata} toggleSubdata={this.toggleSubdata} />
            ) : (
              <Item draggableSnapshot={draggableSnapshot} dragHandleProps={dragHandleProps} data={data} />
            )}
            {this.state.subdata && children}
          </li>
        )}
      </Draggable>
    );
  }
}

ListItem.defaultProps = {
  hasSubList: false
}

ListItem.propTypes = {
  /** Children to render - usually sublist */
  children: childrenShape,
  /** Actual Data passed to ListItem */
  data: PropTypes.object, // eslint-disable-line
  /** Define if this ListItem has SubList a.k.a deeper level */
  hasSubList: PropTypes.bool.isRequired,
  /** Item itself to render */
  Item: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired
}