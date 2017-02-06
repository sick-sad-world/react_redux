// Import utility stuff
// ===========================================================================
import { bindAll, reduce } from 'lodash';
import { inject } from '../helpers/functions';
import deletable from '../helpers/deletable';


// Import React related stuff
// ===========================================================================
import React from 'react';
import Icon from './icon';

// Abstract Page list component
// ===========================================================================
export default class ListSection extends React.Component {
  // Set initial state
  // ===========================================================================
  constructor (props) {
    super(props);
    inject(this, deletable);
    this.state = {
      deleting: 0,
      payload: props.payload
    };
    bindAll(this, 'createListItem', 'createHandler');
  }

  componentWillReceiveProps (newProps) {
    if (newProps.state === 2) this.setState({payload: newProps.payload});
  }

  // Create list item component
  // @ used in data mapping
  // ===========================================================================
  createListItem (acc, item) {
    acc.push(React.cloneElement(this.props.children, Object.assign({
      key: item.id,
      order: item.order,
      current: item.id === this.props.curId,
      sortable: this.props.sortable,
      deleteAction: (this.props.deletable) ? this.makeDeleteToggler(item.id) : null
    }, item)));
    if (this.state.deleting > 0 && this.state.deleting === item.id) {
      acc.push(this.renderDeleteDialog());
    }
    return acc;
  }

  createHandler (e) {
    e.preventDefault();
    this.props.createItem(e.target.elements.name.value);
    e.target.elements.name.value = '';
  }

  render () {
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
              reduce(this.state.payload, this.createListItem, []) : 
                (<li className='state-empty'><Icon icon='emoji-sad' />{this.props.texts.empty}</li>) 
          }
        </ul>
      </section>
    );
  }
}

ListSection.defaultProps = {
  texts: {
    title: 'List title',
    description: 'List description.',
    placeholder: 'New item name',
    btn: 'Create new item',
    deleting: 'Are you sure want to delete this?',
    empty: 'List is empty.'
  }
}