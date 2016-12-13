// Import React related stuff
// ===========================================================================
import React from 'react';
import Icon from './icon';

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
    }
    this.stateDelete = this.stateDelete.bind(this);
    this.handlerDelete = this.handlerDelete.bind(this);
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

  // Handler for new item creation
  // @ launches actionCreate property
  // ===========================================================================
  handlerCreate (e) {
    e.preventDefault();
    let input = e.target.elements.name;
    let { type, items } = this.props;
    this.props.actionCreate(type, input.value, items.length).then(() => {input.value = ''})
  }

  // Run DELETE action itself
  // @ provide required params
  // ===========================================================================
  handlerDelete (e) {
    e.preventDefault();
    this.props.actionDelete(this.props.type, this.state.deleting);
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
      <div style={{bottom: this.state.dialogPos+'px'}} className='small-popup delete-confirmation' ref='confirmation'>
        <span>Are you sure about that?</span>
        <p>
          <a href='' onClick={this.handlerDelete} className='is-button is-neutral'>Delete</a>
          <a href='' onClick={e => {
            e.preventDefault();
            this.stateDelete(0, 0);
          }} className='is-button'>Cancel</a>
        </p>
      </div>
    ) : null;

    // Return DOM components
    // ===========================================================================
    return (
      <section className='mod-subsection-list'>
        <header className='subsection-header'>
          <div className='text'>
            <h1>{texts.title}</h1>
            <p>{texts.description}</p>
            <form onSubmit={this.handlerCreate.bind(this)}>
              <input type='text' name='name' required placeholder={texts.placeholder} />
              <button className='size-90' title={texts.btn}>Add</button>
            </form>
          </div>
        </header>
        <ul className='subsection-content entity-list'>
          {(items.length) ? items.map(this.createListItem.bind(this)) : empty }
        </ul>
        {confimation}
      </section>
    );
  }
} 