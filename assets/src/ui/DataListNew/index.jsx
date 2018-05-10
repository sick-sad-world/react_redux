import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { childrenShape } from 'shared/typings';
import ListItem from './ListItem';
import List from './List';
import Row from './Row';

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

const getSubdataTarget = (data, sid, idx) => data.filter(({id}) => sid === id).map(({subdata}) => subdata[idx])[0];

const updateIndexedState = (prop, i) => {
  return (state) => ({[prop]: (i === undefined || i === state[prop]) ? null: i})
}

const getTemplate = ({columns}) => {
  return columns.reduce((acc, {size}, i) => {
    if (i) acc += ' ';
    acc += `${size}`;
    return acc;
  }, '')
}

export default class DataList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDragging: false,
      data: props.data,
      actions: null
    }
    this.template = getTemplate(props.config);
    this.subtemplate = (props.config.subdata) ? getTemplate(props.config.subdata) : null;
    bindAll(this, 'onDragEnd', 'onDragStart', 'renderListItem', 'renderSubListItem', '_makeRootRef', 'clearActionMenu');
  }

  componentWillReceiveProps({data, config}) {
    this.template = getTemplate(config);
    this.subtemplate = (config.subdata) ? getTemplate(config.subdata) : null;
    this.setState(() => ({data}));
  }

  componentDidUpdate() {
    const method = (this.state.actions !== null) ? 'addEventListener' : 'removeEventListener';
    document.body[method]('click', this.clearActionMenu)
  }

  onDragStart() {
    this.setState({
      isDragging: true
    });
  }

  onDragEnd({draggableId, type, destination, source, reason}) {
    if (!destination) return;

    const sourceId = parseInt(source.droppableId);
    const targetId = parseInt(destination.droppableId);
    const isSourceInner = source.droppableId.indexOf('inner') > -1;
    const isTargetInner = destination.droppableId.indexOf('inner') > -1;
    const isDropWithinSame = isSourceInner && isTargetInner;
    const isDropOnItem = isSourceInner && destination.droppableId.indexOf('inner-item') > -1;

    let result = null;

    if (sourceId === targetId) {
      if (isDropWithinSame) {
        result = this.state.data.map((item) => {
          if (targetId === item.id) {
            return {
              ...item,
              subdata: reorder(item.subdata, source.index, destination.index)
            }
          }
          return item;
        });
      } else {
        result = reorder(this.state.data, source.index, destination.index);
      }
    } else {
      result = this.state.data.map((item) => {
        if (targetId === item.id) {
          return {
            ...item,
            subdata: addAt(
              item.subdata, (isDropOnItem) ? 0 : destination.index,
              getSubdataTarget(this.state.data, sourceId, source.index)
            )
          }
        } else if (sourceId === item.id) {
          return {
            ...item,
            subdata: item.subdata.filter(({id}) => id !== source.index)
          };
        }
        return item;
      });
    }

    this.setState(() => ({
      isDragging: false,
      data: result
    }));
    
  }
  
  _makeRootRef(el) {
    this.root = el;
  }

  clearActionMenu({target}) {
    if (!this.root.contains(target)) {
      this.setState(updateIndexedState('actions'))
    }
  }

  renderListItem({dragHandleProps, toggleSubdata, data}) {
    return (
      <Droppable droppableId={`${data.id}-inner-item`} type='inner'>
        {({innerRef, placeholder}, {isDraggingOver}) => (
          <Row
            dragHandleProps={dragHandleProps}
            toggleSubdata={toggleSubdata}
            ref={innerRef}
            data={data}
            config={this.props.config}
            template={this.template}
          />
        )}
      </Droppable>
    );
  }

  renderSubListItem({dragHandleProps, toggleSubdata, data}) {
    return (
      <Row
        dragHandleProps={dragHandleProps}
        toggleSubdata={toggleSubdata}
        data={data}
        config={this.props.config}
        template={this.subtemplate}
      />
    );
  }

  render() {
    const { rootClassName, className, sortable } = this.props; 
    const { data } = this.state;
    return (
      <div ref={this._makeRootRef} className={classNames(rootClassName, className)}>
        <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
          <List droppableId='outer' type='outer'>
            {data.map(({subdata, ...item}, i) => (
              <ListItem key={item.id} draggableId={item.id} index={i} type='outer' data={item} Item={this.renderListItem}>
                {(subdata) && (
                  <List droppableId={`${item.id}-inner`} type='inner'>
                    {subdata.map((item, i) => (
                      <ListItem key={item.id} draggableId={item.id} index={i} type='inner' data={item} Item={this.renderSubListItem} />
                    ))}
                  </List>
                )}
              </ListItem>
            ))}
          </List>
        </DragDropContext>
      </div>
    );
  }
}

DataList.defaultProps = {
  sortable: true,
  rootClassName: 'DataList--root',
  errorState: {
    title: 'We encountered error during data retrieval',
    text: null,
    additional: null
  },
  emptyState: {
    title: 'This list is empty',
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, nisi.',
    additional: null
  }
}

DataList.propTypes = {
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  /** Whatever sortable wrappers should be applied */
  sortable: PropTypes.bool.isRequired,
  /** Config For column sizes renderers, and order */
  config: PropTypes.shape({
    columns: configColumnShape.isRequired,
    actions: configActionShape,
    subdata: PropTypes.shape({
      columns: configColumnShape.isRequired,
      actions: configActionShape
    })
  }).isRequired,
  /** ClassName applied to root component */
  className: classNameShape,
  /** Configure Error state of DataList */
  errorState: PropTypes.shape(listStateRendererShape).isRequired,
  /** Configure Empty state of DataList */
  emptyState: PropTypes.shape(listStateRendererShape).isRequired,
  /** Data collection to display */
  data: PropTypes.arrayOf(PropTypes.object).isRequired
}