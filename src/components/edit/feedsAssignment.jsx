// Import utility stuff
// ===========================================================================
import { forOwn } from 'lodash';
import classNames from 'classnames';
import { updateArrayWithValue } from '../../helpers/functions';

// Import React related stuff
// ===========================================================================
import React from 'react';

// Import Child components
// ===========================================================================
import Sourceset from '../list/sourceset';
import Source from '../list/source';
import EditForm from './editForm';
import Feeds from '../../containers/feeds';

// Edit Column
// ===========================================================================
export default class AssignFeedsToColumn extends EditForm {

  mapDataToState (data) {
    return {
      name: data.name,
      id: data.id,
      set: data.sets,
      source: data.sources,
      changed: [],
    };
  }

  feedsHandler () {
    return (type, id) => this.stateUpdater(type, updateArrayWithValue(this.state[type], id))
  }

  updateHandler (e) {
    e.preventDefault();
    let data = {
      id: this.state.id,
      name: this.state.name,
      open: this.state.open,
      display_settings: this.state.display_settings,
    };

    forOwn(this.state, (v, k) => {
      if (data.hasOwnProperty(k) || v === '') return;
      if (k === 'changed' || k.indexOf('sort') === 0 || k.indexOf('adv_') === 0) return;
      if (v instanceof Array && !v.length) return;
      data.data[k] = v;
    });
    
    return this.props.update(data);
  }

  render () {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.data) return null;
    let running = this.props.state > 2;

    let componentRootClass = classNames({
      'mod-subsection-management': true,
      'state-loading': running
    });


    return (
      <section className={componentRootClass}>
        { this.renderFormHeader() }
        { this.renderConfirmation() }
        <div className='subsection-content mod-submanagement'>
          <div className='selected'>
            <div className='header'>
              <span>Column has {this.state.set.length} sets and {this.state.source.length} sources assigned.</span>
            </div>
            <ul className='entity-list'>
              <li className='list-title'><h4>Sets selected</h4></li>
              { (this.state.own_sets.length) ? this.state.own_sets.map((set) => {
                return <Sourceset key={set.id} {...set} buttons={[this.createDeselectButton('set', set.id)]} />
              }) : (<li className='state-empty'>{this.props.texts.empty_set}</li>) }
              <li className='list-title'><h4>Sources selected</h4></li>
              { (this.state.own_sources.length) ? this.state.own_sources.map((source) => {
                return <Source key={source.id} {...source} button={this.createDeselectButton('source', source.id)} />
              }) : (<li className='state-empty'>{this.props.texts.empty_source}</li>) }
            </ul>
          </div>
          <Feeds 
            disable={{set: this.state.sets, source: this.state.sources}}
            disabled={running}
            action={this.feedsHandler()}
          />
        </div>
      </section>
    );
  }
}

AssignFeedsToColumn.defaultProps = {
  texts: {
    title: 'Assign feeds to column',
    description: 'Pick the sourcesets and sources this column to watch here.',
    confirmation: '{data} was changed. Save changes?'
  }
};