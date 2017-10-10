// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import { updateArrayWithValue } from 'functions';
import { concat, find, bindAll } from 'lodash';
import { defaultInterface, coreInterface } from '../defaults';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

// Import Child components
// ===========================================================================
import TextInput from 'common/components/forms/input-text';
import { Select, Deselect, SelectAll } from 'common/components/buttons';
import statefullForm, { injectedProps } from 'common/hocs/statefull-form';
import SectionWrapper from 'common/section';
import Confirmation from 'common/components/confirmation';
import { FeedsList } from 'src/feeds';
import SetsWithContents from './list';

class EditSet extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, 'submitForm');
  }

  submitForm() {
    this.props.onSubmit(this.props.submit());
  }

  mergeFeeds({ type, id }, values, props) {
    if (type === 'set') {
      return concat(values.source_ids, find(props.sets, { id }).source_ids);
    }
    return updateArrayWithValue(values.source_ids, id);
  }

  makeFeedUpdater(data) {
    return () => this.props.makeUpdater('source_ids', this.mergeFeeds)(data);
  }

  render() {
    const { state, changed, values, texts, backUrl, reset, bindInput, makeUpdater, emptyFeeds } = this.props;
    const running = state === 3;
    const title = (values.name) ? `${texts.title} "${values.name}"` : texts.title;
    return (
      <SectionWrapper title={title} description={texts.description} url={backUrl} className='mod-sourceset-edit'>
        {(changed.length) ? (
          <Confirmation text={texts.confirmation} changed={changed} apply={this.submitForm} cancel={reset} />
        ) : null}
        <form className='subsection-content columned'>
          <div className='form-block'>
            <TextInput
              className='row'
              name='name'
              label='Sourceset name'
              disabled={running}
              {...bindInput('name')}
            />
            <div className='row'>
              <Link to={`${backUrl}/${values.id}/create`} className='button is-accent'>Create new feeds</Link>
            </div>
          </div>
          {(FeedsList) ? (
            <div className='form-block'>
              <h4 className='row'>Feeds management</h4>
              <section className='mod-submanagement'>
                <div className={classNames('selected', { 'state-disabled': running })}>
                  <div className='header'>
                    <span>Sourceset has {values.source_ids.length} sources total.</span>
                  </div>
                  <FeedsList set_id={values.id} criterea={{ source_ids: values.source_ids, uniq_ids: values.uniq_ids }} empty={emptyFeeds} >
                    {({ id }) => <Deselect onClick={this.makeFeedUpdater({ type: 'source', id })} />}
                  </FeedsList>
                </div>
                <SetsWithContents
                  payload={this.props.sets}
                  disabled_sources={values.source_ids}
                  setAction={({ id }) => <SelectAll onClick={this.makeFeedUpdater({ type: 'set', id })} />}
                  feedAction={({ id }) => <Select onClick={this.makeFeedUpdater({ type: 'source', id })} />}
                />
              </section>
            </div>
          ) : null}
        </form>
      </SectionWrapper>
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
  sets: PropTypes.arrayOf(PropTypes.shape(coreInterface)).isRequired,
  ...injectedProps
};

export default statefullForm({
  propTypes: {
    data: PropTypes.shape(defaultInterface).isRequired
  }
})(EditSet);
