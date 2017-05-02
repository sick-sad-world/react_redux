import React from 'react';
import { includes } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Simple component to display HTML scrapping results
// ===========================================================================
export default function ResultsRss({ texts, data, loading, chosen, onClick, className }) {
  let DOM = null;

  if (loading) {
    DOM = <li className='state-empty'>{texts.loading}</li>;
  } else if (!data) {
    DOM = <li className='state-empty'>{texts.initial}</li>;
  } else if (data) {
    if (data.length) {
      DOM = data.map((item, i) => (
        <li className={classNames('mod-entity', {
          'is-selected': includes(chosen, item.uri)
        })} onClick={onClick(item.uri)} key={`${item.uri}_${i}`} >
          <div>
            <a className='text'>
              <span className='url'>
                <em className='badge' data-type='RSS'>{item.format}</em> {item.title}
              </span>
            </a>
          </div>
        </li>
      ));
    } else {
      DOM = <li className='state-empty'>{ texts.empty}</li>;
    }
  }

  return (
    <div className={classNames(className, { 'result-rss': true })}>
      <h3 className='t-heading'>{ texts.title }</h3>
      <ul className='entity-list result'>
      {DOM}
      </ul>
    </div>
  );
}

ResultsRss.defaultProps = {
  texts: {
    title: 'RSS feeds detected for URL',
    empty: 'No RSS/XML/ATOM feed found for this URL',
    initial: 'Enter a URL and click "Test URL" to check if an RSS feed can be found.',
    loading: 'Searching for RSS/XML/ATOM feeds, please wait...'
  },
  data: null,
  loading: false
};

ResultsRss.propTypes = {
  className: PropTypes.string,
  texts: PropTypes.shape({
    title: PropTypes.string.isRequired,
    empty: PropTypes.string.isRequired,
    initial: PropTypes.string.isRequired,
    loading: PropTypes.string.isRequired
  }),
  data: PropTypes.arrayOf(PropTypes.object),
  chosen: PropTypes.arrayOf(PropTypes.string).isRequired,
  loading: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};
