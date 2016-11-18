import React from "react";

import ListItem from "./listItem";

export default class PageList extends React.Component {
  createHandler(e) {
    e.preventDefault();
    this.props.createAction(e.target.elements.name.value);
  }

  render () {
    let texts = Object.assign({
      title: "List title",
      description: "List description.",
      placehodler: "New item name",
      btn: "Create new item",
      deleting: "Are you sure want to delete this?",
      empty: "List is empty."
    }, this.props.texts);

    let empty = <li className="state-emtpy">{texts.empty}</li>;

    return (
      <section className="mod-subsection-list">
        <header className="subsection-header">
          <div className="text">
            <h1>{texts.title}</h1>
            <p>{texts.description}</p>
            <form onSubmit={this.createHandler}>
              <input type="text" name="name" pattern="^[a-zA-Z_-]+$" placeholder={texts.placehodler} />
              <button name="funCreate" className="size-90" title={texts.btn}>Add</button>
            </form>
          </div>
        </header>
        <ul className="subsection-content entity-list funItemsList">
          {(this.props.items.length) ? this.props.items.map((item)=>(<ListItem key={item.id} name={item.name} id={item.id} />)) : empty }
          
        </ul>
      </section>
    );
  }
} 