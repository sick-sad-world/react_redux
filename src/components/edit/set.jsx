// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import { reduce } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { Link } from 'react-router';

// Import Child components
// ===========================================================================
import EditForm from './editForm';
import Icon from '../icon';

export default class EditSet extends EditForm {

  mapDataToState (data) {
    return {
      changed: [],
      id: data.id,
      name: data.name,
      source_ids: data.source_ids,
      uniq_ids: data.uniq_ids
    };
  }

  render () {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.data) return null;
    let running = this.props.state > 2;

    let componentRootClass = classNames({
      'mod-subsection-edit': true,
      'state-loading': running
    });

    let submanagementClass = classNames({
      'selected': true,
      'state-disabled': running
    });

    return (
      <section className={componentRootClass}>
        <header className='subsection-header'>
          <Link to={this.props.backPath}>
            <Icon icon='chevron-left' />
          </Link>
          <div className='text'>
            <h1>{`${this.props.texts.title} ${(this.state.name) ? ": '"+this.state.name+"'" : ''}`}</h1>
            <p>{this.props.texts.description}</p>
          </div>
        </header>
        { this.renderConfirmation() }
        <form className='subsection-content columned'>
          <div className='form-block'>
            <div className='row'>
              <label htmlFor='funSetName'>Sourceset name:</label>
              <input 
                disabled={running}
                value={this.state.name}
                onChange={this.updateState('name')}
                id='funSetName'
                type='text'
                name='name'
              />
            </div>
            <div className='row'>
              <Link to='create' className='button is-accent'>Create new feeds</Link>
            </div>
          </div>
          <div className='form-block'>
            <h4 className='row'>Feeds management</h4>
            <section className='mod-submanagement'>
              <div className={submanagementClass}>
                <div className='header'>
                  <span>Sourceset has {this.props.sources.length} sources total.</span>
                </div>
                <ul className='entity-list'>
                  {(this.props.sources.length) ? reduce(this.props.sources, (acc, source) => {
                    acc.push(<Source key={source.id} sortable={false} button={this.makeSourceButton(this.state.uniq_ids, source.id)} {...source} />);
                    if (this.state.deleting === source.id) acc.push(this.renderDeleteDialog());
                    return acc;
                  }, []) : this.props.emptyTpl}
                </ul>
              </div>
            </section>
          </div>
        </form>
      </section>
    );
  }
}

EditSet.defaultProps = {
  texts: {
    title: 'Edit form',
    description: 'Simple edit form to manipulate entity props',
    confirmation: '{data} was changed. Save changes?'
  },
  emptyTpl: (<li className='state-empty'>This set has no sources. Please assign some or create.</li>)
};