// Import React related stuff
// ===========================================================================
import React from 'react';
import Icon from './icon';

// Abstract Page list component
// ===========================================================================
export default class PageList extends React.Component {
  
  // Create list item component
  // @ used in data mapping
  // ===========================================================================
  createListItem (item) {
    item.current = item.id === this.props.curId;
    return React.cloneElement(this.props.children, Object.assign({key: item.id}, item))
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
      </section>
    );
  }
} 