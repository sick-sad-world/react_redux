// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import { inject, updateArrayWithValue } from '../../helpers/functions';
import { reject, includes, reduce, concat } from 'lodash';
import deletable from '../../helpers/deletable';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { Link } from 'react-router';

// Import Child components
// ===========================================================================
import EditForm from './editForm';
import Icon from '../icon';
import FeedsList from '../list/feeds';
import Source from '../list/source';

export default class EditSet extends EditForm {

  constructor (props) {
    super(props);
    inject(this, deletable);
    this.state.deleting = 0;
  }

  mapDataToState (data) {
    return {
      changed: [],
      id: data.id,
      name: data.name,
      source_ids: data.source_ids,
      uniq_ids: data.uniq_ids
    };
  }

  getSourceIds(id) {
    return (id instanceof Array) ? concat(this.state.source_ids, id) : updateArrayWithValue(this.state.source_ids, id);
  }

  render () {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.data) return null;
    let running = this.props.state > 2;

    let sourceHandler = this.updateState('source_ids', 'getSourceIds');

    return (
      <section className={classNames({
        'mod-subsection-edit': true,
        'mod-sourceset-edit': true,
        'state-loading': running
      })}>
        { this.renderFormHeader() }
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
              <Link to={`${this.props.backPath}/${this.props.data.id}/create`} className='button is-accent'>Create new feeds</Link>
            </div>
          </div>
          <div className='form-block'>
            <h4 className='row'>Feeds management</h4>
            <section className='mod-submanagement'>
              <div className={classNames({
                'selected': true,
                'state-disabled': running
              })}>
                <div className='header'>
                  <span>Sourceset has {this.state.source_ids.length} sources total.</span>
                </div>
                <ul className='entity-list'>
                  {(this.state.source_ids.length) ? reduce(this.props.sources, (acc, source) => {
                    let btn = null;
                    if (includes(this.state.source_ids, source.id)) {
                      if (includes(this.state.uniq_ids, source.id)) {
                        btn = <a onClick={this.makeDeleteToggler(source.id)} title='Delete this source'><Icon icon='trash' /></a>;
                      } else {
                        btn = <a onClick={() => sourceHandler(source.id)} title='Remove this source from set'><Icon icon='forward' /></a>;
                      }
                      acc.push(<Source key={source.id} sortable={false} button={btn} {...source} />);
                    }
                    if (this.state.deleting === source.id) {
                      acc.push(this.renderDeleteDialog());
                    }
                    return acc;
                  }, []) : this.props.emptyTpl}
                </ul>
              </div>
              <FeedsList sets={reject(this.props.sets, {id: this.state.id})} sources={this.props.sources} disable={{source: this.state.source_ids}} action={sourceHandler} />
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