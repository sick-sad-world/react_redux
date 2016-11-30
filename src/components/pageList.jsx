import React from 'react';
import Icon from './icon';

export default class PageList extends React.Component {
  
  createListItem (item) {
    return React.cloneElement(this.props.children, Object.assign({key: item.id}, item))
  }

  render () {
    let items = this.props.items;
    let texts = Object.assign({
      title: 'List title',
      description: 'List description.',
      placehodler: 'New item name',
      btn: 'Create new item',
      deleting: 'Are you sure want to delete this?',
      empty: 'List is empty.'
    }, this.props.texts);

    let empty = <li className='state-empty'><Icon icon='emoji-sad' />{texts.empty}</li>;

    return (
      <section className='mod-subsection-list'>
        <header className='subsection-header'>
          <div className='text'>
            <h1>{texts.title}</h1>
            <p>{texts.description}</p>
            <form onSubmit={this.props.handlerSubmit}>
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