// Import utility stuff
// ===========================================================================
import { transform, bindAll, mapValues, isArray, concat, filter, find, without } from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { stateNum } from 'common/typecheck';

// Import actions
// ===========================================================================
import { notification } from 'src/notifications';
import { createFeed } from '../actions';

// Import Child components
// ===========================================================================
import Dropdown from 'common/components/forms/dropdown';
import { EditFormHeader } from 'common/components/edit-form-hoc';
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
      type: 'autodetect',
      url: '',
      feed: [],
      results: {
        RSS: true,
        HTML: true,
        Facebook: true
      }
    };

    bindAll(this, ['setUrl', 'chooseFeedType', 'chooseAutodetect', 'selectFeed', 'setFacebookFeed', 'setSingleFeed']);
  }

  createFeeds(e) {
    e.preventDefault();
    this.props.createFeed(this.state.feed).then(this.props.onCreate);
  }

  getFeedsUri() {
    return this.state.feed.map(({ url }) => url);
  }

  chooseFeedType(type, check, val) {
    this.setState({
      type,
      feed: [],
      url: (check) ? this.state.url : '',
      results: mapValues(this.state.results, (v, k) => {
        if (type === k) {
          return true;
        } else if (type === 'autodetect') {
          return (check) ? !!((check === k) ? val : v) : true;
        }
        return false;
      })
    });
  }

  chooseAutodetect(e) {
    return this.chooseFeedType('autodetect', e.target.value, e.target.checked);
  }

  selectFeed(type) {
    return (feed) => {
      if (this.inFeeds(feed)) {
        this.setState({ feed: filter(this.state.feed, v => v.feed !== feed) });
      } else {
        this.setState({ feed: concat({ set_id: this.props.set.id, feed, type, url: this.state.url }, this.state.feed) });
      }
    };
  }

  setSingleFeed(e) {
    return this.setState({
      url: e.target.value,
      feed: [{
        url: e.target.value,
        set_id: this.props.set.id,
        type: this.state.type,
        feed: e.target.value
      }]
    });
  }

  setFacebookFeed(e) {
    if (e.target.name === 'feed') {
      this.setState({
        feed: [{
          ...(this.state.feed[0] || {}),
          feed: e.target.value
        }]
      });
    } else {
      this.setSingleFeed(e);
    }
  }

  setUrl(e) {
    this.setState({ url: e.target.value });
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
        <EditFormHeader
          title={`${texts.title} ${this.props.set.name}`}
          description={texts.description}
          url={`${this.props.backPath}/${this.props.set.id}`}
        />
        <div className='subsection-content create-form-body'>
          <div className='input-area'>
            <Dropdown
              className='switcher-row'
              label='Type of source:'
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
              if (v === true) acc.push(k);
              return acc;
            }, [])}
            value={this.state.url}
            success={!!this.state.feed.length}
            testHandler={this.checkFeed}
            onChange={this.setUrl}
            onSubmit={this.createFeeds}
            changeType={this.chooseAutodetect}
          />;
      case 'RSS':
        return <FormRss
            running={running}
            value={this.state.url}
            success={!!this.state.feed.length}
            onChange={this.setUrl}
            onSubmit={this.createFeeds}
            testHandler={this.checkFeed}
          />;
      case 'HTML':
        return <FormHtml
            running={running}
            value={this.state.url}
            success={!!this.state.feed.length}
            onChange={this.setUrl}
            onSubmit={this.createFeeds}
            testHandler={this.checkFeed}
          />;
      case 'Facebook':
        return <FormFacebook
            running={running}
            url={this.state.url}
            feed={(this.state.feed[0]) ? this.state.feed[0].feed : ''}
            success={!!this.state.url.length}
            onChange={this.setFacebookFeed}
            onSubmit={this.createFeeds}
          />;
      case 'Twitter':
        return <FormTwitter
            running={running}
            value={this.state.url}
            success={!!this.state.url.length}
            onChange={this.setSingleFeed}
            onSubmit={this.createFeeds}
          />;
      case 'Reddit':
        return <FormReddit
            running={running}
            value={this.state.url}
            success={!!this.state.url.length}
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
          <ResultsFacebook
            data={(this.state.results.Facebook.length) ? this.state.results.Facebook : []}
            chosen={this.getFeedsUri()}
            loading={running}
            onClick={this.selectFeed('Facebook')}
          />
          <ResultsRss
            data={(this.state.results.RSS.length) ? this.state.results.RSS : []}
            chosen={this.getFeedsUri()}
            loading={running}
            onClick={this.selectFeed('RSS')}
          />
          <ResultsHtml
            data={(this.state.results.HTML.length) ? this.state.results.HTML : []}
            loading={running}
          />
        </div>;
      default:
        return null;
    }
  }
}

FeedCreate.defaultProps = {
  types: [
    { value: 'autodetect', label: 'Autodetect' },
    { value: 'RSS', label: 'RSS/XML/ATOM Feed' },
    { value: 'HTML', label: 'HTML Scraping' },
    { value: 'Facebook', label: 'Facebook Page' },
    { value: 'Twitter', label: 'Twitter Search' },
    { value: 'Reddit', label: '(Sub)Reddit' }
  ],
  checkUrls: {
    RSS: 'find_feeds',
    HTML: 'find_urls',
    Facebook: 'find_facebook'
  },
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
  types: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  set: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  createFeed: PropTypes.func.isRequired,
  backPath: PropTypes.string.isRequired,
  onCreate: PropTypes.func.isRequired
};

// Connect our Container to State
// @ deps -> Feeds
// ===========================================================================
function mapStateToProps() {
  return ({ feeds }, props) => ({ state: feeds.state });
}

function mapDispatchToProps(dispatch) {
  return {
    createFeed(data) {
      return Promise.all(data.map(feed => dispatch(createFeed(feed)).then(({ payload }) => payload.id)));
    }
  };
}

export default connect(mapStateToProps(), mapDispatchToProps)(FeedCreate);
