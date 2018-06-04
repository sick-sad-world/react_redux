import bindAll from 'lodash/bindAll';
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { childrenShape, idShape } from 'shared/typings';

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

  renderItem(provided = {}) {
    const { data, Item, hasSubList } = this.props;
    return (hasSubList) ? (
      <Item {...provided} data={data} subdata={this.state.subdata} toggleSubdata={this.toggleSubdata} />
    ) : (
      <Item {...provided} data={data} />
    )
  }

  render() {
    const { children, Item, data, hasSubList, sortable, draggableId, ...props } = this.props;
    const listClass = classNames({'sublist-visible': hasSubList && this.state.sublist});
    if (sortable) {
      return (
        <Draggable {...props} draggableId={draggableId}>
          {({innerRef, draggableProps, dragHandleProps}, draggableSnapshot) => (
            <li ref={innerRef} {...draggableProps} className={listClass}>
              {this.renderItem({draggableSnapshot, dragHandleProps})}
              {this.state.subdata && children}
            </li>
          )}
        </Draggable>
      );
    }
    return (
      <li {...props} className={listClass}>
        {this.renderItem()}
        {this.state.subdata && children}
      </li>
    );
  }
}

ListItem.defaultProps = {
  hasSubList: false,
  sortable: true
}

ListItem.propTypes = {
  /** Unique ID for draggable element */
  draggableId: idShape,
  /** Whatever D&D sorting is enabled */
  sortable: PropTypes.bool,
  /** Children to render - usually sublist */
  children: childrenShape,
  /** Actual Data passed to ListItem */
  data: PropTypes.object, // eslint-disable-line
  /** Define if this ListItem has SubList a.k.a deeper level */
  hasSubList: PropTypes.bool.isRequired,
  /** Item itself to render */
  Item: childrenShape.isRequired
}