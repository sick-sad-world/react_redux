import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';
import { extractNumber, contain } from 'shared/utils';
import { classNameShape } from 'shared/typings';
import { Context, List, ListItem, addAt, reorder } from '../DragNDrop';
import ListHeader from './ListHeader';
import StateVisualizer, { stateVisualizerShape } from '../StateVisualizer';
import Row, { configColumnShape, configActionShape } from './Row';
import './styles.scss';

const getSubdataTarget = (data, sid, idx) => data.filter(({id}) => sid === id).map(({subdata}) => subdata[idx])[0];

const getTemplate = ({columns}) => {
  return columns.reduce((acc, {size}, i) => {
    if (i) acc += ' ';
    acc += `${size}`;
    return acc;
  }, '')
}

const SORTABLES = {
  top(data, source, destination, itemId) {
    return {
      shape: {
        item: itemId,
        in: destination.id,
        out: source.id,
        type: 'same-outer'
      },
      result: reorder(data, source.index, destination.index)
    }
  },
  inner(data, source, destination, itemId) {
    const sourceId = extractNumber(source.id, source.id);
    const destId = extractNumber(destination.id, destination.id);
    const isSameTarget = source.id == destination.id;
    let result = data;
    if (isSameTarget) {
      result = data.map((item) => {
        if (destId === item.id) {
          return {
            ...item,
            subdata: reorder(item.subdata, source.index, destination.index)
          }
        }
        return item;
      });
    } else {
      result = data.map((item) => {
        if (destId === item.id) {
          return {
            ...item,
            subdata: addAt(
              item.subdata,
              destination.index,
              getSubdataTarget(data, sourceId, source.index)
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
    }

    return {
      shape: {
        item: itemId,
        in: destId,
        out: sourceId,
        type: isSameTarget ? 'same-inner' : 'to-inner'
      },
      result
    }
  },
  both(data, source, destination, itemId) {
    if (contain(source.id, 'inner') && contain(destination.id, 'inner')) {
      return this.inner(data, source, destination, itemId)
    } else if (source.id === destination.id) {
      return this.top(data, source, destination, itemId);
    }
    return { shape: { type: 'error' }, result: data };
  }
};

export default class DataList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDragging: false,
      data: props.data,
      actions: null
    }
    this.template = getTemplate(props.config);
    this.subtemplate = (props.subconfig) ? getTemplate(props.subconfig) : null;
    bindAll(this, 'onDragEnd', 'onDragStart', 'setActionState', 'renderItem', 'renderSubItem', 'makeClickHandler');
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
    const { shape, result } = SORTABLES[this.props.sortable](
      this.state.data,
      {id: source.droppableId, index: source.index},
      {id: destination.droppableId, index: destination.index},
      extractNumber(draggableId, draggableId)
    );

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

  makeClickHandler(data) {
    const { onItemClick } = this.props;
    if (onItemClick) {
      return () => onItemClick(data);
    }
    return null;
  }

  renderItem({data, subdata, toggleSubdata, dragHandleProps, draggableSnapshot = {}}) {
    const { config } = this.props;
    return (
      <Row
        className={classNames({'state--dragging': draggableSnapshot.isDragging})}
        toggleSubdata={toggleSubdata}
        dragHandleProps={dragHandleProps}
        toggleActions={(config.actions) ? this.setActionState(data.id) : null}
        actionsOpen={this.state.actions === data.id}
        data={data}
        config={config}
        subdata={subdata}
        template={this.template}
        onClick={this.makeClickHandler(data)}
      />
    )
  }

  renderSubItem({data, dragHandleProps, draggableSnapshot = {}}) {
    const { subconfig } = this.props;
    return (
      <Row
        className={classNames({'state--dragging': draggableSnapshot.isDragging})}
        dragHandleProps={dragHandleProps}
        toggleActions={(subconfig.actions) ? this.setActionState(`${data.id}-inner`) : null}
        actionsOpen={this.state.actions === data.id}
        data={data}
        config={subconfig}
        template={this.subtemplate}
        onClick={this.makeClickHandler(data)}
      />
    );
  }

  render() {
    const { rootClassName, className, sortable, errorState, emptyState, config, subconfig } = this.props; 
    const { data } = this.state;
    let content = null;

    const isInner = sortable === 'both' || sortable === 'inner';
    const isOuter = sortable === 'both' || sortable === 'top';

    if (errorState.text) {
      content = <StateVisualizer type='error' className='state--error' {...errorState} />;
    } else if (!data.length) {
      content = <StateVisualizer type='empty' className='state--empty' {...emptyState} />;
    } else {
      content = (
        <Context sortable={!!sortable} onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
          <List sortable={isOuter} droppableId='outer' type='outer' className='list-container'>
            {data.map(({subdata, ...item}, i) => (
              <ListItem
                key={item.id}
                draggableId={item.id}
                sortable={isOuter}
                index={i}
                type='outer'
                data={item}
                Item={this.renderItem}
                hasSubList={!!subconfig}
              >
                <List sortable={isInner} droppableId={`${item.id}-inner`} type='inner' className='sub-list-container'>
                  {subdata.map((subItem, i) => (
                    <ListItem
                      key={`${subItem.id}-${item.id}`}
                      draggableId={`${subItem.id}-${item.id}-inner`}
                      sortable={isInner}
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
        </Context>
      );
    }

    return (
      <div className={classNames(rootClassName, className)}>
        <ListHeader sortable={!!sortable} config={config} template={this.template} />
        {content}
      </div>
    );
  }
}

DataList.defaultProps = {
  sortable: false,
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
  /** D&D Interaction mode. For top level items, or inner items, both of them or none at all */
  sortable: PropTypes.oneOf([false, ...Object.keys(SORTABLES)]).isRequired,
  /** Callback runned when sorting is preformed. Using mostly for sending storing requests to backend */
  onSort: PropTypes.func.isRequired,
  /** Click Handler applied to each row */
  onItemClick: PropTypes.func.isRequired,
  /** Config For column sizes renderers, and order */
  config: PropTypes.shape({
    columns: configColumnShape.isRequired,
    actions: configActionShape,
  }).isRequired,
  /** Config For deeper levle column sizes renderers, and order */
  subconfig: PropTypes.shape({
    columns: configColumnShape.isRequired,
    actions: configActionShape,
  }),
  /** ClassName applied to root component */
  className: classNameShape,
  /** Configure Error state of DataList */
  errorState: PropTypes.shape(stateVisualizerShape).isRequired,
  /** Configure Empty state of DataList */
  emptyState: PropTypes.shape(stateVisualizerShape).isRequired,
  /** Data collection to display */
  data: PropTypes.arrayOf(PropTypes.object).isRequired
}