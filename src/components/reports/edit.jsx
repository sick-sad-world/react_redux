import { filter } from 'lodash';
import React from 'React';
import { connect } from 'react-redux';

class Edit extends React.Component {
  render() {
    let item = this.props.item;
    let texts = Object.assign({
      title: 'Edit form',
      description: 'Simple edit form to manipulate entity props'
    }, this.props.texts);
    
    return (this.props.item) ? (
      <section className='mod-subsection-edit'>
        <header className='subsection-header'>
          <div className='text'>
            <h1>{texts.title} '{ item.name }'</h1>
            <p>{texts.description}</p>
          </div>
        </header>
        <form className='subsection-content'>
        
        </form>
      </section>
    ) : null;
  }
}

let mapStateToProps = ({ reports }, ownProps) => ({
  item: filter(reports, {id: parseInt(ownProps.params.id)})[0]
});

export default connect(mapStateToProps)(Edit);