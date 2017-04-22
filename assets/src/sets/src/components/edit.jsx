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

export default class EditSet extends EditForm {

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

  makeStateUpdater(id) {
    return () => this.updateState('source_ids', 'getSourceIds')('source', id);
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
          <div className='form-block'>
            <h4 className='row'>Feeds management</h4>
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
  }
};

EditSet.propTypes = {
  data: PropTypes.shape(defaultInterface).isRequired,
  sets: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired
};
