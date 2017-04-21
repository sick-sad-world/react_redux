// Import utility stuff
// ===========================================================================
import { bindAll, isEqual } from 'lodash';
import classNames from 'classnames';
import { stateNum } from 'common/typecheck';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Icon from '../icon';

// Abstract Page list component
// ===========================================================================
export class ListSection extends React.Component {
  // Set initial state
  // ===========================================================================
  constructor(props) {
    super(props);
    this.state = {
      payload: props.payload
    };
    bindAll(this, 'createListItem', 'createHandler');
  }

  componentWillReceiveProps(newProps) {
    if (newProps.state === 2) this.setState({ payload: newProps.payload });
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   return !isEqual(nextState.payload, this.state.payload)
  // }

  // Create list item component
  // @ used in data mapping
  // ===========================================================================
  createListItem(item) {
    return React.cloneElement(this.props.children, Object.assign({
      key: item.id,
      order: item.order,
      sortable: this.props.sortable,
      deleteAction: (this.props.deletable && this.props.deleteItem) ? this.props.deleteItem(item) : null
    }, item));
  }

  createHandler(e) {
    e.preventDefault();
    this.props.createItem(e.target.elements.name.value);
    e.target.elements.name.value = '';
  }

  render() {
    return (
      <section className='mod-subsection-list'>
        <header className='subsection-header'>
          <div className='text'>
            <h1>{this.props.texts.title}</h1>
            <p>{this.props.texts.description}</p>
            <form onSubmit={this.createHandler}>
              <input type='text' name='name' required placeholder={this.props.texts.placeholder} />
              <button className='button is-accent size-90' title={this.props.texts.btn}>Add</button>
            </form>
          </div>
        </header>
        <ul className='subsection-content entity-list'>
          {
            (this.props.children && this.state.payload.length) ?
              this.state.payload.map(this.createListItem) :
                (<li className='state-empty'><Icon icon='emoji-sad' />{this.props.texts.empty}</li>)
          }
        </ul>
      </section>
    );
  }
}

ListSection.defaultProps = {
  sortable: true,
  deletable: true,
  texts: {
    title: 'List title',
    description: 'List description.',
    placeholder: 'New item name',
    btn: 'Create new item',
    deleting: 'Are you sure want to delete this?',
    empty: 'List is empty.'
  },
  state: 1,
  payload: []
};

ListSection.propTypes = {
  children: PropTypes.element.isRequired,
  texts: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    btn: PropTypes.string.isRequired,
    deleting: PropTypes.string.isRequired,
    empty: PropTypes.string.isRequired
  }).isRequired,
  sortable: PropTypes.bool.isRequired,
  deletable: PropTypes.bool.isRequired,
  createItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  state: stateNum.isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    order: PropTypes.number
  })).isRequired
};

// Agnostinc list item component
// @using by: ListView and Management views
// ===========================================================================
export class ListItem extends React.PureComponent {
  render() {
    const { disabled, current, url, sortable, name, id, counter, order } = this.props;

    // Drag handle
    // ===========================================================================
    const dragHandle = (sortable) ? <Icon className='drag-handle' icon='dots-three-vertical' /> : null;

    // Make custom icon
    // @show/hide column for example
    // ===========================================================================
    const customIcon = (this.props.customIcon) ? this.props.customIcon(this.props) : null;

    // Make сounter
    // ===========================================================================
    const badge = (counter >= 0) ? <em className='counter'>{counter}</em> : null;

    // Make delete button if item deletable
    // ===========================================================================
    const deleteBtn = (this.props.deleteAction) ? (<a onClick={this.props.deleteAction} title={this.props.deleteText}><Icon icon='trash' /></a>) : null;

    return (
      <li className={classNames({
        'mod-entity': true,
        'is-selected': current === id && !disabled,
        'is-disabled': disabled && current !== id
      })} data-order={order}>
        <div>
          { dragHandle }
          <div className='text'>
            <Link to={ (current === id) ? url : `${url}/${id}` }>{ badge } { name }</Link>
          </div>
          {(customIcon || deleteBtn) ? (
            <nav className='nav-links'>
            { customIcon }
            { deleteBtn }
            </nav>
          ) : null }
        </div>
      </li>
    );
  }
}

ListItem.propTypes = {
  id: PropTypes.num.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  sortable: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  current: PropTypes.bool.isRequired,
  counter: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  order: PropTypes.number,
  deleteText: PropTypes.string,
  customIcon: PropTypes.func,
  deleteAction: PropTypes.func
};
