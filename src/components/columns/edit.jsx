import { filter } from 'lodash';
import React from 'React';
import { connect } from 'react-redux';
import { Link } from 'react-router';

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
            <h1>{texts.title} <Link to={`/dashboard/${item.id}`}>'{ item.name }'</Link></h1>
            <p>{texts.description}</p>
          </div>
        </header>
        <form className='subsection-content'>
        
        </form>
      </section>
    ) : null;
  }
}

let mapStateToProps = ({ columns }, ownProps) => ({
  item: filter(columns, {id: parseInt(ownProps.params.id)})[0]
});

export default connect(mapStateToProps)(Edit);