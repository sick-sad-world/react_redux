// Import utility stuff
// ===========================================================================
import { transform, bindAll, mapValues, concat, filter } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { stateNum, optionShape } from 'common/typecheck';

// Import actions
// ===========================================================================
import { feedTypes } from '../defaults';
import { setFeedsState, createFeed, testUrl } from '../actions';

// Import Child components
// ===========================================================================
import Dropdown from 'common/components/forms/dropdown';
import SectionHeader from 'common/section/header';
import FormAutodetect from '../components/form-autodetect';
import FormFacebook from '../components/form-facebook';
import FormRss from '../components/form-rss';
import FormHtml from '../components/form-html';
import FormTwitter from '../components/form-twitter';
import FormReddit from '../components/form-reddit';
import ResultsFacebook from '../components/results-facebook';
import ResultsRss from '../components/results-rss';
import ResultsHtml from '../components/results-html';

class FeedCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      type: 'autodetect',
      url: '',
      feeds: [],
      results: {
        RSS: true,
        HTML: true,
        Facebook: true
      }
    };

    bindAll(this, ['setUrl', 'checkFeed', 'chooseFeedType', 'chooseAutodetect', 'selectFeed', 'setFacebookFeed', 'setSingleFeed', 'setError', 'createFeeds']);
  }

  createFeeds(e) {
    e.preventDefault();
    this.props.createFeed(this.state.feeds).then(this.props.onCreate);
  }

  setError(error) {
    this.setState({ error });
  }

  checkFeed(e) {
    e.preventDefault();
    let tests = [this.state.type];
    if (this.state.type === 'autodetect') {
      tests = transform(this.state.results, (acc, v, k) => {
        if (v === true) acc.push(k);
        return acc;
      }, []);
    }
    this.props.testUrl(tests, this.state.url).then(results => this.setState({
      feeds: (results.HTML && results.HTML.length) ? [this.createFeed({ type: 'HTML' })] : [],
      results: {
        ...this.state.results,
        ...results
      }
    })).catch(this.setError);
  }

  createFeed(data) {
    return {
      type: this.state.type,
      url: this.state.url,
      set_id: this.props.set.id,
      feed: this.state.url,
      ...data
    };
  }

  getFeedsUri() {
    return this.state.feeds.map(({ feed }) => feed);
  }

  chooseFeedType(type, test) {
    const newResults = mapValues(this.state.results, (v, k) => {
      if (type === k) {
        return true;
      } else if (type === 'autodetect') {
        return (test === k) ? !v : true;
      }
      return false;
    });

    this.setState({
      type,
      feeds: ((newResults.HTML instanceof Array) && newResults.HTML.length) ? [this.createFeed({ type: 'HTML' })] : [],
      url: (test) ? this.state.url : '',
      results: newResults
    });
  }

  chooseAutodetect(value) {
    return this.chooseFeedType('autodetect', value);
  }

  selectFeed(type) {
    return feed => () => {
      if (this.state.feeds.find(v => v.feed === feed)) {
        this.setState({ feeds: filter(this.state.feeds, v => v.feed !== feed) });
      } else {
        this.setState({ feeds: concat(this.createFeed({ type, feed }), this.state.feeds) });
      }
    };
  }

  setSingleFeed(url) {
    return this.setState({
      url,
      feeds: [this.createFeed()]
    });
  }

  setFacebookFeed(name) {
    return value => this.setState({
      url: (name === 'url') ? value : this.state.url,
      feeds: [this.createFeed({ [name]: value })]
    });
  }

  setUrl(url) {
    this.setState({ url });
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    const running = this.props.state > 2;
    const texts = this.props.texts;

    return (
      <section className={classNames({
        'mod-subsection-management': true,
        'mod-create-source': true,
        'state-loading': running
      })}>
        <SectionHeader
          title={`${texts.title} ${this.props.set.name}`}
          description={texts.description}
          url={`${this.props.backPath}/${this.props.set.id}`}
        />
        <div className='subsection-content create-form-body'>
          <div className='input-area'>
            <Dropdown
              className='switcher-row'
              label='Type of source'
              name='feed_type'
              options={this.props.types}
              disabled={running}
              value={this.state.type}
              onChange={this.chooseFeedType}
            />
            {this.renderForm(running)}
          </div>
          <div className='result-area'>
            {this.renderResults(running)}
          </div>
        </div>
      </section>
    );
  }

  renderForm(running = this.props.state > 2) {
    switch (this.state.type) {
      case 'autodetect':
        return <FormAutodetect
            running={running}
            activeTypes={transform(this.state.results, (acc, v, k) => {
              if (v) acc.push(k);
              return acc;
            }, [])}
            value={this.state.url}
            success={!!this.state.feeds.length}
            testHandler={this.checkFeed}
            onChange={this.setUrl}
            onSubmit={this.createFeeds}
            changeType={this.chooseAutodetect}
          />;
      case 'RSS':
        return <FormRss
            running={running}
            value={this.state.url}
            success={!!this.state.feeds.length}
            onChange={this.setUrl}
            onSubmit={this.createFeeds}
            testHandler={this.checkFeed}
          />;
      case 'HTML':
        return <FormHtml
            running={running}
            value={this.state.url}
            success={!!this.state.feeds.length}
            onChange={this.setUrl}
            onSubmit={this.createFeeds}
            testHandler={this.checkFeed}
          />;
      case 'Facebook':
        return <FormFacebook
            running={running}
            url={this.state.url}
            feed={(this.state.feeds[0]) ? this.state.feeds[0].feed : ''}
            onChange={this.setFacebookFeed}
            onSubmit={this.createFeeds}
          />;
      case 'Twitter':
        return <FormTwitter
            running={running}
            value={this.state.url}
            onChange={this.setSingleFeed}
            onSubmit={this.createFeeds}
          />;
      case 'Reddit':
        return <FormReddit
            running={running}
            value={this.state.url}
            onChange={this.setSingleFeed}
            onSubmit={this.createFeeds}
          />;
      default:
        return null;
    }
  }

  renderResults(running = this.props.state > 2) {
    switch (this.state.type) {
      case 'Facebook':
        return <ResultsFacebook
            className='result-container'
            data={(this.state.results.Facebook.length) ? this.state.results.Facebook : []}
            chosen={this.getFeedsUri()}
            loading={running}
            onClick={this.selectFeed('Facebook')}
          />;
      case 'RSS':
        return <ResultsRss
            className='result-container'
            data={(this.state.results.RSS.length) ? this.state.results.RSS : []}
            chosen={this.getFeedsUri()}
            loading={running}
            onClick={this.selectFeed('RSS')}
          />;
      case 'HTML':
        return <ResultsHtml
            className='result-container'
            data={(this.state.results.HTML.length) ? this.state.results.HTML : []}
            loading={running}
          />;
      case 'autodetect':
        return <div className='result-container result-autodetect'>
          {(this.state.results.Facebook) ? <ResultsFacebook
            data={(this.state.results.Facebook.length) ? this.state.results.Facebook : []}
            chosen={this.getFeedsUri()}
            loading={running}
            onClick={this.selectFeed('Facebook')}
          /> : null}
          {(this.state.results.RSS) ? <ResultsRss
            data={(this.state.results.RSS.length) ? this.state.results.RSS : []}
            chosen={this.getFeedsUri()}
            loading={running}
            onClick={this.selectFeed('RSS')}
          /> : null}
          {(this.state.results.HTML) ? <ResultsHtml
            data={(this.state.results.HTML.length) ? this.state.results.HTML : []}
            loading={running}
          /> : null}
        </div>;
      default:
        return null;
    }
  }
}

FeedCreate.defaultProps = {
  types: feedTypes,
  texts: {
    title: 'Create new feeds for:',
    description: 'Feed creation dialog',
    autodetectHeading: 'Scraping, RSS and Facebook tests',
    autodetectDefault: 'Enter a URL and click "Test URL" to check if an facebook page, RSS feed, or plain links can be found.'
  }
};

FeedCreate.propTypes = {
  state: stateNum.isRequired,
  texts: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    autodetectHeading: PropTypes.string.isRequired,
    autodetectDefault: PropTypes.string.isRequired
  }).isRequired,
  types: optionShape('string').isRequired,
  set: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  createFeed: PropTypes.func.isRequired,
  backPath: PropTypes.string.isRequired,
  onCreate: PropTypes.func.isRequired,
  testUrl: PropTypes.func.isRequired
};

// Connect our Container to State
// @ deps -> Feeds
// ===========================================================================
function mapStateToProps() {
  return ({ feeds }, props) => ({ state: feeds.state });
}

function mapDispatchToProps(dispatch) {
  return {
    testUrl(tests, url) {
      dispatch(setFeedsState(3));
      return dispatch(testUrl(tests, url)).then((results) => {
        dispatch(setFeedsState(2));
        return results;
      });
    },

    createFeed(data) {
      return Promise.all(data.map(feed => dispatch(createFeed(feed, { state: false })).then(({ payload }) => payload.id)));
    }
  };
}

export default connect(mapStateToProps(), mapDispatchToProps)(FeedCreate);
