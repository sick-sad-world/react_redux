import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash/bindAll';
import cn from 'classnames';
import { childrenShape, classNameShape, idShape } from 'shared/typings';
import { parseSearchStr, contain, isValStr } from 'shared/utils';
import { Context, List, ListItem } from '../DragNDrop';
import Icon from '../Icon';
import './style.scss';

export default class Assignment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      search: ''
    }
    bindAll(this, 'onSearch');
  }

  onSearch({target}) {
    this.setState(() => ({search: target.value}))
  }

  makeOnClick(id, insert) {
    return () => this.props.onChange({
      id,
      selection: insert ? [...this.props.selected, id] : this.props.selected.filter((item) => item !== id)  
    });
  }

  prepareData() {
    const result = this.props.data.reduce((acc, item) => {
      if (this.props.selected.includes(item.id)) {
        acc.selection.push(item);
        if (this.props.showSelected) {
          acc.choises.push({ ...item, selected: true });
        }
      } else {
        acc.choises.push(item);
      }
      return acc;
    }, { selection: [], choises: [] });

    if (this.props.search && isValStr(this.state.search)) {
      const search = Object.entries(parseSearchStr(this.state.search));
      result.choises = result.choises.filter((item) => {
        return search.every(([prop, val]) => {
          return item[prop] === val || ((typeof item[prop] === 'string' || Array.isArray(item[prop])) && contain(item[prop], val))
        })
      });
    }

    return result;
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
      showSelected,
      split,
      sortable,
      headerText,
      placeholder,
      ...props
    } = this.props;
    const { selection, choises } = this.prepareData();

    return (
      <div className={cn(rootClassName, className)} {...props}>
        <Context sortable={sortable}>
          <section className='selection' style={{width: split[0]}}>
            <header>
              <span className='text'>{headerText.replace('%c', selection.length)}</span>
            </header>
            <List sortable={sortable}>
              {selection.map((entry) => (
                <ListItem
                  sortable={sortable}
                  key={entry.id}
                  Item={Item}
                  data={entry}
                  onClick={this.makeOnClick(entry.id)} 
                />
              ))}
            </List>
          </section>
          <section className='choises' style={{width: split[1]}}>
            {(search) && (
              <header className='search'>
                <Icon g='search' />
                <input type='text' name='search' placeholder={placeholder} value={this.state.search} onChange={this.onSearch} />
              </header>
            )}
            <List sortable={sortable}>
              {choises.map((entry) => (
                <ListItem
                  sortable={sortable}
                  key={entry.id}
                  Item={Item}
                  data={entry}
                  onClick={this.makeOnClick(entry.id, true)} 
                />
              ))}
            </List>
          </section>
        </Context>
      </div>
    );
  }
}

Assignment.defaultProps = {
  sortable: false,
  showSelected: true,
  placeholder: 'Type to search',
  rootClassName: 'Assignment--root',
  headerText: '%c items selected',
  split: ['40%','60%']
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
  search: PropTypes.string,
  /** Placeholder for search field */
  placeholder: PropTypes.string,
  /** Whateer D&D interaction are enabled */
  sortable: PropTypes.bool,
  /** Show selected items or omit them */
  showSelected: PropTypes.bool
  // /** String represents data property to group by, if not provided - search is disabled */
  // group: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
}