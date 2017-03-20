// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import { updateArrayWithValue } from '../../helpers/functions';

// Import React related stuff
// ===========================================================================
import React from 'react';

// Import Child components
// ===========================================================================
import EditForm from './edit-form';
import Feeds from '../../containers/feeds';

// Edit Column
// ===========================================================================
export default class AssignFeedsToColumn extends EditForm {

  mapDataToState (data) {
    return {
      name: data.name,
      set: data.data.set || [],
      source: data.data.source || [],
      changed: [],
    };
  }

  feedsHandler () {
    return (type, id) => this.stateUpdater({
      [type]: updateArrayWithValue(this.state[type], id)
    });
  }

  updateHandler (e) {
    e.preventDefault();
    let data = {
      id: this.props.data.id,
      data: {
        ...this.props.data.data,
        set: (this.state.set.length) ? this.state.set : undefined,
        source: (this.state.source.length) ? this.state.source : undefined
      }
    };
    
    return this.props.update(data, this.state.changed);
  }

  render () {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.data) return null;
    let running = this.props.state > 2;


    return (
      <section className={classNames({
        'mod-subsection-management': true,
        'state-loading': running
      })}>
        { this.renderFormHeader() }
        { this.renderConfirmation() }
        <Feeds
          className='subsection-content mod-submanagement'
          current={{set: this.state.set, source: this.state.source}}
          disabled={running}
          action={this.feedsHandler()}
        />
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