// Import utility stuff
// ===========================================================================
import { forOwn, bindAll, mapValues, isArray } from 'lodash';
import classNames from 'classnames';
import fetch from '../../fetch';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// Import Child components
// ===========================================================================
import Select from 'react-select';
import Icon from '../icon';

// Import actions
// ===========================================================================
import { createData, throwError } from '../../actions/actions';

class FeedCreation extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      type: 'autodetect',
      url: '',
      feed: [''],
      checks: {
        find_urls: true,
        find_feeds: true,
        find_facebook: true
      },
      results: false
    }

    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      createData: createData('source'),
      throwError: throwError
    }, this.props.dispatch);

    bindAll(this, ['checkFeed', 'chooseFeedType', 'generateResultArea', 'generateResults', 'generateResult']);
  }

  // Generate form for Autodetect
  // @return DOM
  // ===========================================================================
  generateautodetectform () {
    return (
      <form name='autodetect'>
        <div className='row'>
          <label htmlFor='funAutodetectUrl'>URL</label>
          <input
            type='text'
            id='funAutodetectUrl'
            name='url'
            onChange={(e) => this.setState({url: e.target.value})}
            value={this.state.url}
          />
          <small className='form-description'>(if you want to visit the source in your browser, this is where you would go)</small>
        </div>
        <h4>Pick type(s) of source to autodetect</h4>
        <div className='row-flex'>
          <label>
            <span className='switcher-checkbox'>
              <input
                type='checkbox'
                name='type'
                title='RSS Feed'
                value='find_feeds'
                checked={this.state.checks.find_feeds}
                onChange={e => this.chooseFeedType('autodetect', e.target.value, e.target.checked)}
              />
              <Icon icon='check' />
            </span>
            RSS
          </label>
          <label>
            <span className='switcher-checkbox'>
              <input
                type='checkbox'
                name='type'
                title='Facebook Page'
                value='find_facebook'
                checked={this.state.checks.find_facebook}
                onChange={e => this.chooseFeedType('autodetect', e.target.value, e.target.checked)}
              />
              <Icon icon='check' />
            </span>
            Facebook
          </label>
          <label>
            <span className='switcher-checkbox'>
              <input
                type='checkbox'
                name='type'
                title='HTML Scraping'
                value='find_urls'
                checked={this.state.checks.find_urls}
                onChange={e => this.chooseFeedType('autodetect', e.target.value, e.target.checked)}
              />
              <Icon icon='check' />
            </span>
            HTML
          </label>
        </div>
        <div className='row button-group'>
          <input type='button' className='button size-half is-accent' onClick={this.checkFeed} value="Test URL" />
          <input className='button size-half is-accent' disabled={!this.state.feed[0].length} type='button' value='Create' />
        </div>
        <div className='form-description'>{ this.props.texts.autodetect.desrc }</div>
      </form>
    )
  }

  // Generate form for RSS feed search
  // @return DOM
  // ===========================================================================
  generateRSSform () {
    return (
      <form name='RSS'>
        <div className='row'>
          <label htmlFor='funRssUrl'>URL</label>
          <input
            type='text'
            name='url'
            id='funRssUrl'
            onChange={(e) => this.setState({url: e.target.value})}
            value={this.state.url}
          />
          <small>(if you want to visit the source in your browser, this is where would you go)</small>
        </div>
        <div className='row button-group'>
          <input type='submit' value="Test URL" onClick={this.checkFeed} className='button is-accent size-half' />
          <input className='button is-accent size-half' disabled={!this.state.feed[0].length} type='button' value='Create' />
        </div>
        <div className='form-description'>{ this.props.texts.RSS.desrc }</div>
      </form>
    );
  }

  // Generate form for HTML scrapping
  // @return DOM
  // ===========================================================================
  generateHTMLform () {
    return (
      <form name='HTML'>
        <div className='row'>
          <label form='funHtmlUrl'>URL</label>
          <input
            type='text'
            name='url'
            id='funHtmlUrl'
            onChange={(e) => this.setState({url: e.target.value})}
            value={this.state.url}
          />
          <small>(if you want to visit the source in your browser, this is where you would go)</small>
        </div>
        <div className='row button-group'>
          <input type='submit' value="Test URL" onClick={this.checkFeed} className='button is-accent size-half' />
          <input className='button is-accent size-half' disabled={!this.state.feed[0].length} type='button' value='Create' />
        </div>
        <div className='form-description'>{ this.props.texts.HTML.desrc }</div>
      </form>
    );
  }

  // Generate form for Facebook page
  // @return DOM
  // ===========================================================================
  generateFacebookform () {
    return (
      <form name='Facebook'>
        <div className='row'>
          <label form='funFacebookFeedUrl'>Facebook URL</label>
          <input
            type='text'
            name='feed'
            id='funFacebookFeedUrl'
            onChange={(e) => this.setState({feed: [e.target.value]})}
            value={this.state.feed[0]}
          />
          <small>(URL of a facebook page)</small>
        </div>
        <div className='row'>
          <label form='funFacebookUrl'>URL</label>
          <input
            type='text'
            name='url'
            id='funFacebookUrl'
            onChange={(e) => this.setState({url: e.target.value})}
            value={this.state.url}
          />
          <small>(If the Facebook page is related to a website, enter the URL here, otherwise put the FB URL in here too)</small>
        </div>
        <div className='row'>
          <input className='button is-accent size-half' type='button' value='Create' />
        </div>
        <div className='form-description'>{ this.props.texts.Facebook.desrc }</div>
      </form>
    );
  }

  // Generate form for Twitter feed
  // @return DOM
  // ===========================================================================
  generateTwitterform () {
    return (
      <form name='Twitter'>
        <div className='row'>(Enter the #hashtags or keywords to search on Twitter. Links will be pulled from the tweets that are found.)</div>
        <div className='row'>
          <label htmlFor='funTwitterQuery'>Query</label>
          <input
            type='text'
            name='url'
            placeholder='#hastag or keyword'
            id='funTwitterQuery'
            onChange={(e) => this.setState({url: e.target.value, feed: [e.target.value]})}
            value={this.state.url}
          />
        </div>
        <small className='form-description'>{ this.props.texts.Twitter.desrc }</small>
        <div className='row'>
          <input className='button is-accent size-half' type='button' value='Create' />
        </div>
      </form>
    );
  }

  // Generate form for Reddit feed
  // @return DOM
  // ===========================================================================
  generateRedditform () {
    return (
      <form name='Reddit'>
        <div className='row'>
          <label htmlFor='funRedditFeed'>(The part after /r/ in the URL of this subreddit)</label>
          <span className='input-wrap size-wide'>
            <input
              type='text'
              name='url'
              placeholder='subreddit'
              id='funRedditFeed'
              onChange={(e) => this.setState({url: e.target.value, feed: [e.target.value]})}
              value={this.state.url}
            />
          </span>
        </div>
        <small className='form-description'>{ this.props.texts.Reddit.desrc }</small>
        <div className='row'>
          <input className='button is-accent size-half' type='button' value='Create' />
        </div>
      </form>
    );
  }

  // Generate result area to display check results
  // @return DOM
  // ===========================================================================
  generateResultArea () {
    let type = this.state.type;
    return (type !== 'Twitter' && type !== 'Reddit' && type !== 'Facebook') ? (
      <div className='result-area'>
        <h5 className='t-heading'>{ this.props.texts[this.state.type].resultHeading }</h5>
        <ul className='entity-list result'>
          { (!this.state.results) ? <li className='state-empty'>{this.props.texts[this.state.type].resultDefault}</li> : this.generateResults() }
        </ul>
      </div>
    ) : null;
  }

  // Generate check results by itself
  // @return DOM
  // ===========================================================================
  generateResults () {
    if (this.state.type === 'autodetect') {
      let items = [];
      forOwn(this.state.results, (v, k) => {
        // Push heading
        // ===========================================================================
        let heading = <li key={`heading_${k}`}><h4>{this.props.texts[k].resultHeading}</h4></li>
        items.push(heading);
        if (v.length) {
          // Iterate over results
          // ===========================================================================
          v.forEach((item, i) => {
            items.push(this.generateResult(item, i, k));
          });
        } else {
          // Or push empty message
          // ===========================================================================
          items.push(<li className='state-empty'>{this.props.texts[k].resultEmpty}</li>);
        }
      });
      return items;
    } else {
      return (this.state.results.length) ? this.state.results.map(this.generateResult) : (<li className='state-empty'>{this.props.texts[this.state.type].resultEmpty}</li>);
    }
  }

  // Generate single result
  // @return DOM
  // ===========================================================================
  generateResult(item, i, type) {
    if (typeof type !== 'string') {
      type = this.state.type;
    }

    switch (type) {
      case 'RSS':
        return (
          <li className='mod-entity' key={`${type}_${i}`}>
            <div>
              <a href={item.uri} className='text'>
                <span className='url'>
                  <em className='badge' data-type={type}>{item.format}</em> {item.title}
                </span>
              </a>
            </div>
          </li>
        );
      case 'HTML':
        return (
          <li key={`type_${i}`}><a href={item} target='_blank'>{item}</a></li>
        );
      case 'Facebook':
        return (
          <li className='mod-entity' key={`type_${i}`}>
            <div>
              <a href={item} target='_blank' className='text'>
                <span className='url'>
                  <em className='counter' data-type={type}>{type}</em>
                  {item}
                </span>
              </a>
            </div>
          </li>
        );
    }
  }

  // Choose whatever we should search for
  // ===========================================================================
  chooseFeedType (type, check, val) {
    this.setState({
      type: type,
      feed: [''],
      results: false,
      checks: mapValues(this.state.checks, (v, k) => {
        switch (type) {
          case 'RSS':
            return k === 'find_feeds';
          case 'HTML':
            return k === 'find_urls';
          case 'autodetect':
            return (!check) ? true : (check === k) ? val : v;
          default:
            return v;
        }
      })
    })
  }

  // Run URL look up
  // ===========================================================================
  checkFeed (e) {
    e.preventDefault();
    let checks = [];
    let url = this.state.url;

    // Show proper message if URL is not match criterea
    // ===========================================================================
    if (!url.length) {
      return this.actions.throwError('Provide reasonable url to test');
    }

    // Define - what type will be used
    // ===========================================================================
    forOwn(this.state.checks, (v, k) => {
      if (v) checks.push(k);
    });

    // Run each of them (possible multiple items)
    // ===========================================================================
    checks.forEach((check) => {
      fetch(check, {url})
        .then(payload => {
          let results, type;
          // Cut down payload length it it exceeds limit
          // ===========================================================================
          if (payload.length > 50) {
            payload.length = 50;
          }
          
          if (this.state.type === 'autodetect') {
            // Set proper type key
            // ===========================================================================
            switch (check) {
              case 'find_feeds':
                type = 'RSS';
                break;
              case 'find_urls':
                type = 'HTML';
                break;
              case 'find_facebook':
                type = 'Facebook';
                break;
            }

            // Set autodetect results
            // ===========================================================================
            results = (!isArray(this.state.results)) ? this.state.results || {} : {};
            results[type] = payload;
            this.setState({results});
          } else {
            this.setState({results: payload});
          }
        })
        .catch(this.actions.throwError)
    });
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.set_id || !this.props.params.create) return null;
    let running = this.props.appState === 3;
    let type = this.state.type;
    let texts = this.props.texts;

    let componentRootClass = classNames({
      'mod-subsection-management': true,
      'mod-create-source': true,
      'state-loading': running
    });

    return (
      <section className={componentRootClass}>
        <header className='subsection-header'>
          <div className='text'>
            <h1>{texts.title}</h1>
            <p>{texts.description}</p>
          </div>
        </header>
        <div className='subsection-content create-form-body'>
          <div className='input-area'>
            <div className='switcher-row'>
              <span className='form-label'>Type of source:</span>
              <Select 
                disabled={running}
                name='feed_type'
                options={this.props.types}
                onChange={({value}) => this.chooseFeedType(value)}
                autosize={false}
                clearable={false}
                searchable={false}
                value={this.state.type}
              />
            </div>
            { (this[`generate${type}form`]) ? this[`generate${type}form`]() : null }
          </div>
          { this.generateResultArea() }
        </div>
      </section>
    );
  }
}

FeedCreation.defaultProps = {
  types: [
    {value: 'autodetect' , label: 'Autodetect' },
    {value: 'RSS' , label: 'RSS/XML/ATOM Feed' },
    {value: 'HTML' , label: 'HTML Scraping' },
    {value: 'Facebook' , label: 'Facebook Page' },
    {value: 'Twitter' , label: 'Twitter Search' },
    {value: 'Reddit' , label: '(Sub)Reddit' }
  ],
  texts: {
    title: 'New feeds creation',
    description: 'Feed creation dialog',
    autodetect: {
      resultHeading: 'Scraping, RSS and Facebook tests',
      resultDefault: 'Enter a URL and click "Test URL" to check if an facebook page, RSS feed, or plain links can be found.',
      descr: 'Selecting one of feeds founded by given url will make RSS type feed. If this is facebook feed - it will create Facebook type feed. Else it will create HTML feed.'
    },
    RSS: {
      resultHeading: 'RSS feeds detected for URL',
      resultLoading: 'Searching for RSS/XML/ATOM feeds, please wait...',
      resultDefault: 'Enter a URL and click "Test URL" to check if an RSS feed can be found.',
      resultEmpty: 'No RSS/XML/ATOM feed found for this URL',
      descr: 'Click "Test URL" and click one or more of the detected feeds (if any appear), then click "Create" to start tracking them.'
    },
    HTML: {
      resultHeading: 'Links found via HTML scraping at the given URL',
      resultDefault: 'Enter a URL and click "Test URL" to check if links can be found using HTML Scraping.',
      resultLoading: 'Testing if links can be found via HTML scraping, please wait...',
      resultEmpty: 'No links found via HTML Scraping for this URL',
      descr: 'Click "Test URL".  If links appear in the right hand pane and some of them are links to articles, HTML scraping works for this site. Click "Create" to start tracking the site using this method.'
    },
    Facebook: {
      resultHeading: 'Check if given url related to a Facebook page',
      resultDefault: 'Enter a URL and click "Test URL" to check if a Facebook page can be found.',
      resultLoading: 'Testing if URL is related to a Facebook page, please wait...',
      resultEmpty: 'No related Facebook page found for this URL',
      desc: 'Searching for Facebook pages related to URL.'
    },
    Twitter: {
      resultHeading: '',
      descr: 'Create source based on a Twitter search'
    },
    Reddit: {
      resultHeading: '',
      descr: 'Create source based on a subreddit at Reddit'
    }
  }
}

let mapStateToProps = ({ sources, app }, ownProps) => ({
  appState: app.appState,
  set_id: parseInt(ownProps.params.id)
});

export default connect(mapStateToProps)(FeedCreation);