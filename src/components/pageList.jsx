// Import utility stuff
// ===========================================================================
import { bindAll, reduce } from 'lodash';
import { inject } from '../helpers/functions';
import deletable from './behaviours/deletable';


// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import Icon from './icon';

// Import actions
// ===========================================================================
import { createAction, throwError } from '../actions/actions';

// Abstract Page list component
// ===========================================================================
export default class PageList extends React.Component {
  // Set initial state
  // ===========================================================================
  constructor (props) {
    super(props);
    inject(this, deletable);
    this.state = {
      deleting: 0,
      items: props.items
    };

    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      create: createAction(this.props.type, 4),
      delete: createAction(this.props.type, 6),
      throwError: throwError
    }, this.props.dispatch);

    // Bind methods to instance
    // ===========================================================================
    bindAll(this, ['handlerCreate', 'createListItem'])
  }

  componentWillReceiveProps (newProps) {
    if (newProps.state === 2) this.setState({items: newProps.items});
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
      deleteAction: (this.props.deletable) ? this.makeDeletingStateToggler(item.id) : null
    }, item)));
    if (this.state.deleting > 0 && this.state.deleting === item.id) {
      acc.push(this.renderDeleteDialog());
    }
    return acc;
  }

  // Handler for new item creation
  // @ launches actionCreate property
  // ===========================================================================
  handlerCreate (e) {
    e.preventDefault();
    let value = e.target.elements.name.value;

    e.target.elements.name.value = '';

    if (this.props.create === 'delayed') {
      // Redirect to edit form if need
      // ===========================================================================
      this.props.router.push({
        pathname: this.props.router.location.pathname+'/new',
        query: {name: value}
      });
    } else {
      // Create item
      // ===========================================================================
      this.actions.create({name: value, order: this.props.items.length}).catch(this.actions.throwError);
    }
  }

  render () {
    // Define variables via destructing
    // Define text defaults
    // ===========================================================================
    let texts = Object.assign({
      title: 'List title',
      description: 'List description.',
      placeholder: 'New item name',
      btn: 'Create new item',
      deleting: 'Are you sure want to delete this?',
      empty: 'List is empty.'
    }, this.props.texts);

    // Empty item template
    // @ used when items list is empty
    // ===========================================================================
    let empty = <li className='state-empty'><Icon icon='emoji-sad' />{texts.empty}</li>;

    // Return DOM components
    // ===========================================================================
    return (
      <section className='mod-subsection-list'>
        <header className='subsection-header'>
          <div className='text'>
            <h1>{texts.title}</h1>
            <p>{texts.description}</p>
            <form onSubmit={this.handlerCreate}>
              <input type='text' name='name' required placeholder={texts.placeholder} />
              <button className='button is-accent size-90' title={texts.btn}>Add</button>
            </form>
          </div>
        </header>
        <ul className='subsection-content entity-list'>
          {(this.state.items.length) ? reduce(this.state.items, this.createListItem, []) : empty }
        </ul>
      </section>
    );
  }
}