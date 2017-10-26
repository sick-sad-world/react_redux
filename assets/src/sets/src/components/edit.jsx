// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import { updateArrayWithValue } from 'functions';
import { defaultInterface } from '../defaults';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

// Import Child components
// ===========================================================================
import TextInput from 'common/components/forms/input-text';
import Spinner from 'common/components/spinner';
import { Select, Deselect } from 'common/components/buttons';
import makeSearchable from 'common/hocs/searchable';
import statefullForm, { injectedProps } from 'common/hocs/statefull-form';
import SectionWrapper from 'common/section';
import Confirmation from 'common/components/confirmation';
import { FeedsList } from 'src/feeds';
import SetsList from '../containers/composed-list';

const SearchableList = makeSearchable(({ search, bindSearch, children }) => (
  <div className='list'>
    <div className='header'>
      <input type='text' name='search' placeholder='Search for...' {...bindSearch}/>
    </div>
    {children(search)}
  </div>
));

class EditSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedsLoading: 0
    };
  }

  makeFeedHandler(method = '', source_id) {
    return () => {
      this.setState({ feedsLoading: source_id });
      this.props[method]({
        source_id,
        set_id: this.props.values.id,
        source_ids: updateArrayWithValue(this.props.values.source_ids, source_id)
      }).catch(console.error).then(() => this.setState({ feedsLoading: 0 }));
    };
  }

  render() {
    const { loading, changed, values, texts, backUrl, submit, reset, bindInput, emptyFeeds } = this.props;
    const title = (values.name) ? `${texts.title} "${values.name}"` : texts.title;
    return (
      <SectionWrapper title={title} description={texts.description} url={backUrl} className='mod-sourceset-edit'>
        {(changed.length || loading) ? (
          <Confirmation text={texts.confirmation} changed={changed} loading={loading} apply={submit} cancel={reset} />
        ) : null}
        <form className='subsection-content columned'>
          <div className='form-block'>
            <TextInput
              className='row'
              name='name'
              label='Sourceset name'
              disabled={loading}
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
                <div className={classNames('selected', { 'state-disabled': loading })}>
                  <div className='header'>
                    <span>Sourceset has {values.source_ids.length} sources total.</span>
                  </div>
                  <FeedsList
                    set_id={values.id}
                    criterea={{
                      ids: values.source_ids
                    }}
                    empty={emptyFeeds}
                    actions
                  >
                    {({ id }) => {
                      if (id === this.state.feedsLoading) {
                        return <a><Spinner/></a>;
                      }
                      return <Deselect onClick={this.makeFeedHandler('removeFeed', id)} />;
                    }}
                  </FeedsList>
                </div>
                <SearchableList>
                  {search => (search) ? (
                    <FeedsList set_id={values.id} criterea={{ search, disabled: values.source_ids }}>
                      {({ id }) => {
                        if (id === this.state.feedsLoading) {
                          return <a><Spinner/></a>;
                        }
                        return <Select onClick={this.makeFeedHandler('addFeed', id)} />;
                      }}
                    </FeedsList>
                  ) : (
                    <SetsList criterea={{ omit: [values.id] }}>
                      {({ source_ids }) => (
                        <FeedsList set_id={values.id} criterea={{ ids: source_ids, disabled: values.source_ids }}>
                        {({ id }) => {
                          if (id === this.state.feedsLoading) {
                            return <a><Spinner/></a>;
                          }
                          return <Select onClick={this.makeFeedHandler('addFeed', id)} />;
                        }}
                        </FeedsList>
                      )}
                    </SetsList>
                  )}
                </SearchableList>
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
  addFeed: PropTypes.func.isRequired,
  ...injectedProps
};

export default statefullForm({
  propTypes: {
    data: PropTypes.shape(defaultInterface).isRequired
  },
  mapStateToData({ source_ids, ...values }) {
    return values;
  }
})(EditSet);
