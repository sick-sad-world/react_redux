import React from 'React';

export default class PageEdit extends React.Component {
  constructor (props) {
    super(props);
    if (!this.props.item.length) return null;
  }

  render() {
    let item = this.props.item;
    let texts = Object.assign({
      title: 'Edit form',
      description: 'Simple edit form to manipulate entity props'
    }, this.props.texts);
    
    return (
      <section className='mod-subsection-edit'>
        <header className='subsection-header'>
          <div className='text'>
            <h1>{texts.title} "{ item.name }"</h1>
            <p>{texts.description}</p>
          </div>
        </header>
        <form className="subsection-content ">{this.props.children}</form>
      </section>
    );
  }
}