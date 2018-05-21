import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { classNameShape } from 'shared/typings';
import List from './DragNDrop/List';
import ListItem from './DragNDrop/Item';
import ListHeader from './ListHeader';
import { ListStateRenderer, listStateRendererShape } from './renderers';
import Row, { configColumnShape, configActionShape } from './Row';
import './styles.scss';

const addAt = (list, index, item) => {
  if (!item) return list;
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
    bindAll(this, 'onDragEnd', 'onDragStart', 'setActionState', 'renderItem', 'renderSubItem');
  }

  componentWillReceiveProps({data, config}) {
    this.template = getTemplate(config);
    this.subtemplate = (config.subdata) ? getTemplate(config.subdata) : null;
    this.setState(() => ({data}));
  }

  onDragStart() {
    this.setState({
      isDragging: true
    });
  }

  onDragEnd({destination, source, draggableId}) {
    if (!destination) return;

    const sourceId = parseInt(source.droppableId) || source.droppableId;
    const targetId = parseInt(destination.droppableId) || destination.droppableId;
    const isSourceInner = source.droppableId.indexOf('inner') > -1;
    const isTargetInner = destination.droppableId.indexOf('inner') > -1;
    const isDropWithinSameInner = isSourceInner && isTargetInner && sourceId == targetId;
    const isDropOnItem = isSourceInner && destination.droppableId.indexOf('inner-item') > -1;

    const shape = {
      item: draggableId,
      in: targetId,
      out: sourceId
    }
    let result = null;
    
    if (sourceId === targetId) {
      if (isDropWithinSameInner) {
        result = this.state.data.map((item) => {
          if (targetId === item.id) {
            return {
              ...item,
              subdata: reorder(item.subdata, source.index, destination.index)
            }
          }
          return item;
        });
        shape.type = 'same-inner';
      } else {
        result = reorder(this.state.data, source.index, destination.index);
        shape.type = 'same-outer';
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
            subdata: item.subdata.filter((item, i) => i !== source.index)
          };
        }
        return item;
      });
      shape.type = 'to-inner';
    }

    this.setState(() => ({
      isDragging: false,
      data: result
    }), () => this.props.onSort(shape));
    
  }

  setActionState(i = null) {
    return () => {
      this.setState((state) => ({actions: (!i || i === state.actions) ? null: i}))
    };
  }

  renderItem({data, subdata, toggleSubdata, dragHandleProps}) {
    const { config } = this.props;
    return (
      <Row
        toggleSubdata={toggleSubdata}
        dragHandleProps={dragHandleProps}
        toggleActions={(config.actions) ? this.setActionState(data.id) : null}
        actionsOpen={this.state.actions === data.id}
        data={data}
        config={config}
        subdata={subdata}
        template={this.template}
      />
    )
  }

  renderSubItem({data, dragHandleProps}) {
    const { config } = this.props;
    return (
      <Row
        dragHandleProps={dragHandleProps}
        toggleActions={(config.subdata.actions) ? this.setActionState(`${data.id}-inner`) : null}
        actionsOpen={this.state.actions === data.id}
        data={data}
        config={config.subdata}
        template={this.subtemplate}
      />
    );
  }

  render() {
    const { rootClassName, className, sortable, errorState, emptyState, config } = this.props; 
    const { data } = this.state;
    let content = null;

    if (errorState.text) {
      content = <ListStateRenderer type='error' className='state--error' {...errorState} />;
    } else if (!data.length) {
      content = <ListStateRenderer type='empty' className='state--empty' {...emptyState} />;
    } else {
      content = (
        <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
          <List droppableId='outer' type='outer' className='list-container'>
            {data.map(({subdata, ...item}, i) => (
              <ListItem
                key={item.id}
                draggableId={item.id}
                index={i}
                type='outer'
                data={item}
                Item={this.renderItem}
                hasSubList
              >
                <List droppableId={`${item.id}-inner`} type='inner' className='sub-list-container'>
                  {subdata.map((subItem, i) => (
                    <ListItem
                      key={`${subItem.id}-${item.id}`}
                      draggableId={`${subItem.id}-${item.id}-inner`}
                      index={i}
                      type='inner'
                      data={subItem}
                      Item={this.renderSubItem}
                    />
                  ))}
                </List>
              </ListItem>
            ))}
          </List>
        </DragDropContext>
      );
    }

    return (
      <div className={classNames(rootClassName, className)}>
        <ListHeader sortable={sortable} config={config} template={this.template} />
        {content}
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
  /** Callback runned when sorting is preformed. Using mostly for sending storing requests to backend */
  onSort: PropTypes.func.isRequired,
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