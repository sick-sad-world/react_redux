// Import utility stuff
// ===========================================================================
import { updateArrayWithValue } from 'functions';
import { availableColumnData, defaultInterface } from '../defaults';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';

// Import Child components
// ===========================================================================
import MakeEditForm, { injectedPropsType } from 'common/components/edit-form-hoc';
import { Select, Deselect, SelectAll } from 'common/components/buttons';
import { FeedsList } from 'src/feeds';
import { CompleteList, SetsList } from 'src/sets';

// Feed assginment to columns
// ===========================================================================
class Assignment extends React.Component {

  static getTypeCheck() {
    return {
      data: PropTypes.shape(defaultInterface).isRequired
    };
  }

  static mapDataToState(data) {
    return {
      id: data.id,
      name: data.name,
      set: data.data.set || availableColumnData.set,
      source: data.data.source || availableColumnData.source
    };
  }

  static mapStateToData(state, data, changed, props) {
    return {
      id: state.id,
      name: state.name,
      display_settings: data.display_settings,
      data: {
        ...data.data,
        set: state.set,
        source: state.source
      }
    };
  }

  static getset(value, props, state) {
    return updateArrayWithValue(state.set, value);
  }

  static getsource(value, props, state) {
    return updateArrayWithValue(state.source, value);
  }

  updateData(type) {
    const stateUpdater = this.props.updateState(type, `get${type}`);
    return id => () => stateUpdater(id);
  }

  render() {
    const { running, formValues } = this.props;
    return (
      <form className='subsection-content mod-submanagement'>
        <div className='selected'>
          <div className='header'>
            <span>Column has {formValues.set.length} sets and {formValues.source.length} sources assigned.</span>
          </div>
          <ul className='entity-list'>
            <li className='list-title'><h4>Sets selected</h4></li>
            <li className='mod-entity'>
              <SetsList criterea={{ set_ids: formValues.set }} disabled={running} empty='No sets assigned'>
                <Deselect handler={this.updateData('set')} />
              </SetsList>
            </li>
            <li className='list-title'><h4>Sources selected</h4></li>
            <li className='mod-entity'>
              <FeedsList criterea={{ source_ids: formValues.source }} disabled={running} empty='No feeds assigned'>
                <Deselect handler={this.updateData('source')} />
              </FeedsList>
            </li>
          </ul>
        </div>
        <CompleteList
          disabled={running}
          disabled_sets={formValues.set}
          disabled_sources={formValues.source}
          setAction={<SelectAll handler={this.updateData('set')} />}
          feedAction={<Select handler={this.updateData('source')} />}
        />
      </form>
    );
  }
}

Assignment.propTypes = { ...injectedPropsType };

export default MakeEditForm(Assignment);
