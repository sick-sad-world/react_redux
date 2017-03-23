// Import utility stuff
// ===========================================================================
import { bindAll, isEqual } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import Icon from '../icon';

// Abstract Page list component
// ===========================================================================
export default class ListSection extends React.Component {
  // Set initial state
  // ===========================================================================
  constructor (props) {
    super(props);
    this.state = {
      payload: props.payload
    };
    bindAll(this, 'createListItem', 'createHandler');
  }

  componentWillReceiveProps (newProps) {
    if (newProps.state === 2) this.setState({payload: newProps.payload});
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   return !isEqual(nextState.payload, this.state.payload)
  // }

  // Create list item component
  // @ used in data mapping
  // ===========================================================================
  createListItem (item) {
    return React.cloneElement(this.props.children, Object.assign({
      key: item.id,
      order: item.order,
      sortable: this.props.sortable,
      deleteAction: (this.props.deletable && this.props.deleteItem) ? this.props.deleteItem(item) : null
    }, item));
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
              this.state.payload.map(this.createListItem) : 
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