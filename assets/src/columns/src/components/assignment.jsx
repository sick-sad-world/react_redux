// Import utility stuff
// ===========================================================================
import { updateArrayWithValue } from 'functions';
import { availableColumnData, defaultInterface } from '../defaults';
import { bindAll } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';

// Import Child components
// ===========================================================================
import statefullForm, { injectedProps } from 'common/hocs/statefull-form';
import makeSearchable from 'common/hocs/searchable';
import SectionWrapper from 'common/section';
import Confirmation from 'common/components/confirmation';
import { Select, Deselect, SelectAll } from 'common/components/buttons';
import { FeedsList } from 'src/feeds';
import { ComposedList, SetsList } from 'src/sets';

const SearchableList = makeSearchable(({ search, bindSearch, children }) => (
  <div className='list'>
    <div className='header'>
      <input type='text' name='search' placeholder='Search for...' {...bindSearch}/>
    </div>
    {children(search)}
  </div>
));

// Feed assginment to columns
// ===========================================================================
class Assignment extends React.Component {

  render() {
    const { state, changed, values, texts, backUrl, reset, submit, makeUpdater } = this.props;
    const loading = state === 3;
    const title = (values.name) ? `${texts.title} "${values.name}"` : texts.title;

    // Create Feed handlers to use
    // ===========================================================================
    const setUpdater = makeUpdater('set', (v, { set }) => updateArrayWithValue(set, v));
    const sourceUpdater = makeUpdater('source', (v, { source }) => updateArrayWithValue(source, v));

    return (
      <SectionWrapper title={title} description={texts.description} url={backUrl}>
        {(changed.length || loading) ? (
          <Confirmation text={texts.confirmation} loading={loading} changed={changed} apply={submit} cancel={reset} />
        ) : null}
        <form className='subsection-content mod-submanagement'>
          <div className='selected'>
            <div className='header'>
              <span>Column has {values.set.length} sets and {values.source.length} sources assigned.</span>
            </div>
            <ul className='entity-list'>
              <li className='list-title'><h4>Sets selected</h4></li>
              <li className='mod-entity'>
                <SetsList criterea={{ ids: values.set }} empty='No sets assigned'>
                  {({ id }) => <Deselect onClick={() => setUpdater(id)} />}
                </SetsList>
              </li>
              <li className='list-title'><h4>Sources selected</h4></li>
              <li className='mod-entity'>
                <FeedsList criterea={{ ids: values.source }} empty='No feeds assigned'>
                  {({ id }) => <Deselect onClick={() => sourceUpdater(id)} />}
                </FeedsList>
              </li>
            </ul>
          </div>
          <SearchableList>
            {search => (search) ? (
              <FeedsList criterea={{ search, disabled: values.source }}>
                {({ id }) => <Select onClick={() => sourceUpdater(id)} />}
              </FeedsList>
            ) : (
              <ComposedList criterea={{ disabled: values.set }} actions={({ id }) => <SelectAll onClick={() => setUpdater(id)} />}>
                {({ source_ids }) => (
                  <FeedsList criterea={{ ids: source_ids, disabled: values.source }}>
                    {({ id }) => <Select onClick={() => sourceUpdater(id)} />}
                  </FeedsList>
                )}
              </ComposedList>
            )}
          </SearchableList>
        </form>
      </SectionWrapper>
    );
  }
}

Assignment.propTypes = {
  ...injectedProps
};

export default statefullForm({
  mapDataToState(data) {
    return {
      id: data.id,
      name: data.name,
      set: data.data.set || availableColumnData.set,
      source: data.data.source || availableColumnData.source,
      data: { ...availableColumnData, ...data.data }
    };
  },
  mapStateToData(state) {
    return {
      id: state.id,
      data: {
        ...state.data,
        set: (state.set.length) ? state.set : undefined,
        source: (state.source.length) ? state.source : undefined
      }
    };
  },
  propTypes: {
    data: PropTypes.shape(defaultInterface).isRequired
  }
})(Assignment);
