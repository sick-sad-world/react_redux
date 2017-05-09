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
import { Select, Deselect } from 'common/components/buttons';
import MakeEditForm, { injectedPropsType } from 'common/components/edit-form-hoc';
import { FeedsList } from 'src/feeds';
import SetsWithContents from './list';

class EditSet extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      expanded: null
    };
  }

  static getTypeCheck() {
    return {
      data: PropTypes.shape(defaultInterface).isRequired
    };
  }

  static mapDataToState(data) {
    return {
      changed: [],
      id: data.id,
      name: data.name,
      source_ids: data.source_ids,
      uniq_ids: data.uniq_ids
    };
  }

  static getSourceIds({ type, id }, props, state) {
    return (type === 'set') ?
      concat(state.source_ids, find(props.sets, { id }).source_ids) :
        updateArrayWithValue(state.source_ids, id);
  }


  makeStateUpdater(type) {
    return id => () => this.props.updateState('source_ids', 'getSourceIds')({ type, id });
  }

  render() {
    const { running, formValues, updateState, emptyFeeds } = this.props;
    return (
      <form className='subsection-content columned'>
        <div className='form-block'>
          <TextInput
            className='row'
            name='name'
            label='Sourceset name'
            disabled={running}
            value={formValues.name}
            onChange={updateState('name')}
          />
          <div className='row'>
            <Link to={`${this.props.path}/create`} className='button is-accent'>Create new feeds</Link>
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
                  <span>Sourceset has {formValues.source_ids.length} sources total.</span>
                </div>
                <FeedsList set_id={formValues.id} criterea={{ source_ids: formValues.source_ids, uniq_ids: formValues.uniq_ids }} empty={emptyFeeds} >
                  <Deselect handler={this.makeStateUpdater('source')} />
                </FeedsList>
              </div>
              <SetsWithContents
                payload={this.props.sets}
                disabled_sources={formValues.source_ids}
                setAction={<Select handler={this.makeStateUpdater('set')} />}
                feedAction={<Select handler={this.makeStateUpdater('source')} />}
              />
            </section>
          </div>
        ) : null}
      </form>
    );
  }
}

// Edit sourceset form default props
// ===========================================================================
EditSet.defaultProps = {
  treshold: 3,
  emptyFeeds: 'This set does not contain any feeds. Add some.'
};

// Prop type check
// ===========================================================================
EditSet.propTypes = {
  sets: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired,
  path: PropTypes.string,
  ...injectedPropsType
};

export default MakeEditForm(EditSet);
