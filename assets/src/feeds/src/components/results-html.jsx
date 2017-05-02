import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Simple component to display HTML scrapping results
// ===========================================================================
export default function ResultsHtml({ className, texts, data, loading }) {
  let DOM = null;

  if (loading) {
    DOM = <li className='state-loading'><img src='/img/loading.svg' />{texts.loading}</li>;
  } else if (!data) {
    DOM = <li className='state-empty'>{texts.initial}</li>;
  } else if (data) {
    if (data.length) {
      DOM = data.map((url, i) => <li className='simple-link' key={`${url}_${i}`}><a href={url} target='_blank'>{url}</a></li>);
    } else {
      DOM = <li className='state-empty'>{ texts.empty}</li>;
    }
  }

  return (
    <div className={classNames(className, { 'result-html': true })}>
      <h3 className='t-heading'>{ texts.title }</h3>
      <ul className='entity-list result'>
      {DOM}
      </ul>
    </div>
  );
}

ResultsHtml.defaultProps = {
  texts: {
    title: 'Links found via HTML scraping at the given URL',
    empty: 'No links found via HTML Scraping for this URL',
    initial: 'Enter a URL and click "Test URL" to check if links can be found using HTML Scraping.',
    loading: 'Testing if links can be found via HTML scraping, please wait...'
  },
  data: null,
  loading: false
};

ResultsHtml.propTypes = {
  className: PropTypes.string,
  texts: PropTypes.shape({
    title: PropTypes.string.isRequired,
    empty: PropTypes.string.isRequired,
    initial: PropTypes.string.isRequired,
    loading: PropTypes.string.isRequired
  }),
  data: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool.isRequired
};
