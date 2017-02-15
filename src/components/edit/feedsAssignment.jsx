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
import EditForm from './editForm';
import Feeds from '../../containers/feeds';

// Edit Column
// ===========================================================================
export default class AssignFeedsToColumn extends EditForm {

  mapDataToState (data) {
    return {
      name: data.name,
      id: data.id,
      set: data.set,
      source: data.source,
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