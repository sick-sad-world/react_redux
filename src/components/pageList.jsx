// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import Icon from './icon';
import DeletingPopup from './deletingPopup'
import { bindAll } from 'lodash';

// Import actions
// ===========================================================================
import { createData, deleteData, throwError } from '../actions/actions';

// Abstract Page list component
// ===========================================================================
export default class PageList extends React.Component {
  // Set initial state
  // ===========================================================================
  constructor (props) {
    super(props);
    this.state = {
      deleting: 0,
      dialogPos: 0
    };

    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      createData: createData(this.props.type),
      deleteData: deleteData(this.props.type),
      throwError: throwError
    }, this.props.dispatch);

    bindAll(this, ['stateDelete', 'handlerDelete', 'handlerCreate', 'createListItem'])
  }

  componentWillReceiveProps () {
    // Reset delete dialog position
    // ===========================================================================
    this.stateDelete(0, 0);
  }

  // Set [delete] state, to show confirmation dialog
  // ===========================================================================
  stateDelete (id, dialogPos) {
    this.setState({
      deleting: (this.state.deleting === id) ? 0 : id,
      dialogPos: (this.state.dialogPos === dialogPos) ? 0 : dialogPos,
    });
  }

  // Create list item component
  // @ used in data mapping
  // ===========================================================================
  createListItem (item) {
    return React.cloneElement(this.props.children, Object.assign({
      key: item.id,
      type: this.props.type,
      current: item.id === this.props.curId,
      sortable: this.props.sortable,
      deletable: this.props.deletable,
      stateDelete: this.stateDelete
    }, item))
  }

  // Redirect to edit from with name for a new item
  // ===========================================================================
  routeToNewItemEditForm (name) {
    this.props.router.push({
      pathname: `/${this.props.type}s/new`,
      query: {name: name}
    });
  }

  // Handler for new item creation
  // @ launches actionCreate property
  // ===========================================================================
  handlerCreate (e) {
    e.preventDefault();
    let value = e.target.elements.name.value;

    this.stateDelete(0, 0);
    e.target.elements.name.value = '';

    if (this.props.create === 'delayed') {
      // Redirect to edit form if need
      // ===========================================================================
      this.routeToNewItemEditForm(value);
    } else {
      // Create item
      // ===========================================================================
      this.actions.createData({name: value, order: this.props.items.length}).catch(this.actions.throwError);
    }
  }

  // Run DELETE action itself
  // @ provide required params
  // ===========================================================================
  handlerDelete (e) {
    e.preventDefault();
    this.actions.deleteData({id: this.state.deleting}).catch(this.actions.throwError).then(() => this.stateDelete(0, 0));
  }

  render () {
    // Define variables via destructing
    // Define text defaults
    // ===========================================================================
    let items = this.props.items;
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

    // Make confirmation dialog if item deletable and [deleting] state active
    // ===========================================================================
    let confimation = (this.props.deletable && this.state.deleting > 0 && this.state.dialogPos > 0) ? (
      <DeletingPopup
        dialogPos={{top: `${this.state.dialogPos}px`}}
        handlerDelete={this.handlerDelete}
        handlerCancel={e => this.stateDelete(0, 0)}
      />
    ) : null;

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
          {(items.length) ? items.map(this.createListItem) : empty }
        </ul>
        {confimation}
      </section>
    );
  }
} 