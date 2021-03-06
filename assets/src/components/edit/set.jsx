// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import { updateArrayWithValue } from '../../helpers/functions';
import { reject, includes, reduce, concat, find, bindAll } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { Link } from 'react-router';

// Import Child components
// ===========================================================================
import TextInput from '../forms/input-text';
import EditForm from './edit-form';
import Icon from '../icon';
import FeedsList from '../feeds/list';
import Source from '../feeds/source';

export default class EditSet extends EditForm {

  constructor (props) {
    super(props);
    bindAll(this, 'renderSource');
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

  getSourceIds(type, id) {
    return (type === 'set') ? concat(this.state.source_ids, find(this.props.sets, {id}).source_ids) : updateArrayWithValue(this.state.source_ids, id);
  }

  makeStateUpdater(id) {
    return () => this.updateState('source_ids', 'getSourceIds')('source', id);
  }

  renderSource (acc, source) {
    let btn = null;
    if (includes(this.state.source_ids, source.id)) {
      if (includes(this.state.uniq_ids, source.id)) {
        btn = <a onClick={this.props.deleteItem(source)} title='Delete this source'><Icon icon='trash' /></a>;
      } else {
        btn = <a onClick={this.makeStateUpdater(source.id)} title='Remove this source from set'><Icon icon='forward' /></a>;
      }
      acc.push(<Source key={source.id} sortable={false} button={btn} {...source} />);
    }
    if (this.state.deleting === source.id) {
      acc.push(this.renderDeleteDialog());
    }
    return acc;
  }

  render () {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.data) return null;
    let running = this.props.state > 2;

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
            <TextInput
              className='row'
              name='name'
              label='Sourceset name'
              disabled={running}
              value={this.state.name}
              onChange={this.updateState('name')}
            />
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
                  {(this.state.source_ids.length) ? reduce(this.props.sources, this.renderSource, []) : this.props.emptyTpl}
                </ul>
              </div>
              <FeedsList
                sets={reject(this.props.sets, {id: this.state.id})}
                sources={this.props.sources}
                disable={{source: this.state.source_ids}}
                action={this.updateState('source_ids', 'getSourceIds')}
              />
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