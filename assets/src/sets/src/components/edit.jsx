// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import { updateArrayWithValue } from 'functions';
import { concat, find } from 'lodash';
import { defaultInterface } from '../defaults';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

// Import Child components
// ===========================================================================
import TextInput from 'common/components/forms/input-text';
import EditForm from 'common/components/edit-form';
import { FeedsList } from 'src/feeds';
import SetsWithContents from './list';

export default class EditSet extends EditForm {

  constructor(props) {
    super(props);
    this.state.seach = '';
    this.state.expanded = null;
  }

  mapDataToState(data) {
    return {
      changed: [],
      id: data.id,
      name: data.name,
      source_ids: data.source_ids,
      uniq_ids: data.uniq_ids
    };
  }

  getSourceIds(type, id) {
    return (type === 'set') ?
      concat(this.state.source_ids, find(this.props.sets, { id }).source_ids) :
        updateArrayWithValue(this.state.source_ids, id);
  }


  makeStateUpdater(type) {
    return id => () => this.updateState('source_ids', 'getSourceIds')(type, id);
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.data) return null;
    const running = this.props.state > 2;
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
          {(FeedsList) ? (
            <div className='form-block'>
              <h4 className='row'>Feeds management</h4>
              <section className='mod-submanagement'>
                <div className={classNames({
                  selected: true,
                  'state-disabled': running
                })}>
                  <div className='header'>
                    <span>Sourceset has {this.state.source_ids.length} sources total.</span>
                  </div>
                  <FeedsList
                    set_id={this.props.data.id}
                    criterea={{ source_ids: this.state.source_ids, uniq_ids: this.state.uniq_ids }}
                    action={{
                      name: 'select',
                      title: 'Add this set contents to selection',
                      handler: this.makeStateUpdater('source')
                    }}
                    empty='This set does not contain any feeds. Add some.'
                  />
                </div>
                <SetsWithContents data={this.props.sets} onClick={this.makeStateUpdater} />
              </section>
            </div>
          ) : null}
        </form>
      </section>
    );
  }
}

// Edit sourceset form default props
// ===========================================================================
EditSet.defaultProps = {
  treshold: 3,
  texts: {
    title: 'Edit form',
    description: 'Simple edit form to manipulate entity props',
    confirmation: '{data} was changed. Save changes?'
  }
};

// Prop type check
// ===========================================================================
EditSet.propTypes = {
  data: PropTypes.shape(defaultInterface).isRequired,
  sets: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired
};
