// Import utility stuff
// ===========================================================================
import { find } from 'lodash';
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
      url: ''
    }

    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      createData: createData('source'),
      throwError: throwError
    }, this.props.dispatch); 
  }

  generateautodetectform () {
    return (
      <form name="autodetect">
        <div className="row">
          <label htmlFor="funAutodetectUrl">URL</label>
          <input
            type="text"
            id="funAutodetectUrl"
            name="url"
            onChange={(e) => this.setState({url: e.target.value})}
            value={this.state.url}
          />
          <small className='form-description'>(if you want to visit the source in your browser, this is where you would go)</small>
        </div>
        <h4>Pick type(s) of source to autodetect</h4>
        <div className="row">
          <label>
            <span className="switcher-checkbox">
              <input
                type="checkbox"
                name="type"
                title="RSS Feed"
                value="RSS"
              />
              <Icon icon='check' />
            </span>
            RSS
          </label>
          <label>
            <span className="switcher-checkbox">
              <input
                type="checkbox"
                name="type"
                title="Facebook Page"
                value="Facebook"
              />
              <Icon icon='check' />
            </span>
            Facebook
          </label>
          <label>
            <span className="switcher-checkbox">
              <input
                type="checkbox"
                name="type"
                title="HTML Scraping"
                value="HTML"
              />
              <Icon icon='check' />
            </span>
            HTML
          </label>
        </div>
        <div className="row button-group">
          <input type="button" className="size-half" value="Test url" />
          <input className="size-half" disabled="disabled" type="button" value="Create" />
        </div>
      </form>
    )
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.set_id || !this.props.params.create) return null;
    let running = this.props.appState === 3;
    let { type } = this.state;
    let { texts, set_id } = this.props;

    let componentRootClass = classNames({
      'mod-subsection-management': true,
      'mod-create-source': true,
      'state-loading': running
    });

    let resultArea = (type === 'Twitter' || type === 'Reddit' ) ? (
      <div className='result-area'>
        <h5 className='t-heading'>{texts[this.state.type].resultHeading}</h5>
        <ul className='t-scrollable-y result entity-list'>
        </ul>
      </div>
    ) : null;

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
            <div className=''>
              <span className='form-label'>Type of source:</span>
              <Select 
                disabled={running}
                name='feed_type'
                options={this.props.types}
                onChange={({value}) => this.setState({type: value})}
                autosize={false}
                clearable={false}
                searchable={false}
                value={this.state.autoreload}
              />
            </div>
            { (this[`generate${type}form`]) ? this[`generate${type}form`]() : null }
          </div>
          { resultArea }
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
      resultHeading: 'Scraping, RSS and Facebook tests'
    },
    RSS: {
      resultHeading: 'RSS feeds detected for URL'
    },
    HTML: {
      resultHeading: 'Links found via HTML scraping at the given URL'
    },
    Facebook: {
      resultHeading: 'Check if given url related to a Facebook page'
    },
    Twitter: {
      resultHeading: ''
    },
    Reddit: {
      resultHeading: ''
    }
  }
}

let mapStateToProps = ({ sources }, ownProps) => ({
  set_id: parseInt(ownProps.params.id)
});

export default connect(mapStateToProps)(FeedCreation);