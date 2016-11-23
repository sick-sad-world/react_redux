import React from 'react';
import Icon from './icon';

export default class PageList extends React.Component {
  createHandler(e) {
    e.preventDefault();
    //<Link to={`/${this.props.type}/new`} className='is-button size-wide'>{texts.btn}</Link>
    this.props.createAction({
      order: this.props.items.length,
      name: e.target.elements.name.value
    });
  }

  render () {
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
            <form onSubmit={this.createHandler.bind(this)}>
              <input type='text' name='name' placeholder={texts.placehodler} />
              <button name='funCreate' className='size-90' title={texts.btn}>Add</button>
            </form>
          </div>
        </header>
        <ul className='subsection-content entity-list funItemsList'>
          {(this.props.items.length) ? this.props.items.map((item) => React.cloneElement(this.props.children, Object.assign({key: item.id}, item))) : empty }
        </ul>
      </section>
    );
  }
} 