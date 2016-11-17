import React from "react";

export default class PageList extends React.Component {
  render () {
    let texts = Object.assign({
      title: "List title",
      description: "List description.",
      btn: "Create new item",
      deleting: "Are you sure want to delete this?",
      empty: "List is empty."
    }, this.props.texts);
    
    return (
      <section className="mod-subsection-list">
        <header className="subsection-header">
          <div className="text">
            <h1>{texts.title}</h1>
            <p>{texts.description}</p>
            <form>
              <input type="text" name="name" value="" placeholder="New item name" />
              <button name="funCreate" className="size-90" title={texts.btn}>Add</button>
            </form>
          </div>
        </header>
        <ul className="subsection-content entity-list funItemsList"><li className="state-empty">{texts.empty}</li></ul>
      </section>
    );
  }
} 