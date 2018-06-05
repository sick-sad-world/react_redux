import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash/bindAll';
import cn from 'classnames';
import { childrenShape, classNameShape, idShape } from 'shared/typings';
import { parseSearchStr, contain } from 'shared/utils';
import { Context, List, ListItem, addAt } from '../DragNDrop';
import StateVisualizer, { stateVisualizerShape } from '../StateVisualizer';
import Icon from '../Icon';
import './style.scss';

function updateSelection(sel, entry, insert = -1) {
  return (insert < 0) ? sel.filter((id) => id !== entry)  : addAt(sel, insert, entry) 
}

function filterResults(data, str) {
  const search = Object.entries(parseSearchStr(str));
  return data.filter((item) => {
    return search.every(([prop, val]) => {
      return item[prop] === val || ((typeof item[prop] === 'string' || Array.isArray(item[prop])) && contain(item[prop], val))
    })
  });
}

function prepareData({data, selected, showSelected, search, searchTreshold}) {
  // const result = data.reduce((acc, item) => {
  //   if (selected.includes(item.id)) {
  //     acc.selection.push(item);
  //     if (showSelected) {
  //       acc.choises.push({ ...item, selected: true });
  //     }
  //   } else {
  //     acc.choises.push(item);
  //   }
  //   return acc;
  // }, { selection: [], choises: [] });

  const result = {
    selection: selected.map((id) => data.find((entry) => entry.id === id)),
    choises: (!showSelected) ? data.filter((id) => !contain(selected, id)) : data
  };

  return (state) => {
    if (search && state.search.length > searchTreshold) {
      result.choises = filterResults(result.choises, state.search);
    }
    return result;
  };
}

export default class Assignment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      choises: [],
      selection: [],
      isDragging: false
    }
    bindAll(this, 'onSearch', 'onDragStart', 'onDragEnd', 'renderChoisesItem', 'renderSelectionItem');
  }

  componentWillMount() {
    this.setState(prepareData(this.props))
  }

  componentWillReceiveProps(nextProps) {
    this.setState(prepareData(nextProps))
  }

  onDragStart() {
    this.setState({
      isDragging: true
    });
  }

  onDragEnd({destination, draggableId}) {
    this.runOnChange(draggableId, (destination.droppableId === 'selection') ? destination.index : -1)();
  }

  onSearch({target}) {
    this.setState(({choises}) => ({
      search: target.value,
      choises: filterResults(choises, target.value)
    }))
  }

  runOnChange(id, insert) {
    return () => this.props.onChange({
      id,
      selection: updateSelection(this.props.selected, id, insert)
    });
  }

  renderItem({data, dragHandleProps, draggableSnapshot, onClick}) {
    const { Item, selected } = this.props;
    return (
      <Item
        dragHandleProps={dragHandleProps}
        data={data}
        selected={contain(selected, data.id)}
        className={cn({
          'state--dragging': draggableSnapshot.isDragging,
        })}
        onClick={onClick}
      />
    )
  }

  renderSelectionItem(provided) {
    return this.renderItem({...provided, onClick: this.runOnChange(provided.data.id)});
  }

  renderChoisesItem(provided) {
    return this.renderItem({...provided, onClick: this.runOnChange(provided.data.id, 0)});
  }

  render() {
    const {
      data,
      rootClassName,
      className,
      selected,
      onChange,
      Item,
      search,
      searchTreshold,
      showSelected,
      split,
      sortable,
      headerText,
      placeholder,
      emptyState,
      emptySelection,
      ...props
    } = this.props;
    const { selection, choises } = this.state;

    return (
      <div className={cn(rootClassName, className)} {...props}>
        <Context sortable={sortable} onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
          <section className='selection' style={{width: split[0]}}>
            <header>
              <span className='text'>{headerText.replace('%c', selection.length)}</span>
            </header>
            <List sortable={sortable} droppableId='selection'>
              {selection.length ? (
                selection.map((entry) => (
                  <ListItem
                    draggableId={entry.id}
                    sortable={sortable}
                    key={entry.id}
                    Item={this.renderSelectionItem}
                    data={entry}
                    onClick={this.runOnChange(entry.id)} 
                  />
                ))
              ) : (
                <StateVisualizer type='empty' className='state--empty' {...emptySelection} />
              )}
            </List>
          </section>
          <section className='choises' style={{width: split[1]}}>
            {(search) && (
              <header className='search'>
                <Icon g='search' />
                <input type='text' name='search' placeholder={placeholder} value={this.state.search} onChange={this.onSearch} />
              </header>
            )}
            <List sortable={sortable} droppableId='choises'>
              {choises.length ? (
                choises.map((entry) => (
                  <ListItem
                    draggableId={entry.id}
                    sortable={sortable}
                    key={entry.id}
                    Item={this.renderChoisesItem}
                    data={entry}
                  />
                ))
              ) : (
                <StateVisualizer type='empty' className='state--empty' {...emptyState} />
              )}
            </List>
          </section>
        </Context>
      </div>
    );
  }
}

Assignment.defaultProps = {
  sortable: true,
  showSelected: true,
  search: true,
  searchTreshold: 3,
  placeholder: 'Type to search',
  rootClassName: 'Assignment--root',
  headerText: '%c items selected',
  split: ['40%','60%'],
  emptySelection: {
    title: 'No items selected',
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, nisi.',
    additional: null
  },
  emptyState: {
    title: 'Nothing found here',
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, nisi.',
    additional: null
  }
}

Assignment.propTypes = {
  /** Widths of sections */
  split: PropTypes.arrayOf(PropTypes.string),
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  /** ClassName applied to root component */
  className: classNameShape,
  /** Data Array from which selection is preformed, a.k.a. choises */
  data: PropTypes.arrayOf(PropTypes.shape({
    id: idShape.isRequired
  })),
  /** String in selection header. Usually used to describe count %c replaced with number */
  headerText: PropTypes.string.isRequired,
  /** Array of selected ID's */
  selected: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  /** Function invoked when selection is changed. Used to handle selection in state of outside component */
  onChange: PropTypes.func.isRequired,
  /** Function or Component that will be used to display items */
  Item: childrenShape.isRequired,
  /** String represents data property to search by, if not provided - search is disabled */
  search: PropTypes.bool,
  /** Minimal length of search string to start filtering */
  searchTreshold: PropTypes.number.isRequired,
  /** Placeholder for search field */
  placeholder: PropTypes.string,
  /** Whateer D&D interaction are enabled */
  sortable: PropTypes.bool,
  /** Show selected items or omit them */
  showSelected: PropTypes.bool,
  // /** String represents data property to group by, if not provided - search is disabled */
  // group: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
  /** Configure Selection epty state */
  emptySelection: PropTypes.shape(stateVisualizerShape).isRequired,
  /** Configure Empty state of Choises list */
  emptyState: PropTypes.shape(stateVisualizerShape).isRequired,
}