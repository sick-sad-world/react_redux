import React from 'react';
import { includes } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Simple component to display HTML scrapping results
// ===========================================================================
export default function ResultsFacebook({ className, texts, data, loading, chosen, onClick }) {
  let DOM = null;

  if (loading) {
    DOM = <li className='state-loading'><img src='/img/loading.svg' />{texts.loading}</li>;
  } else if (!data) {
    DOM = <li className='state-empty'>{texts.initial}</li>;
  } else if (data) {
    if (data.length) {
      DOM = data.map((url, i) => (
        <li className={classNames('mod-entity', { 'is-selected': includes(chosen, url) })} onClick={onClick(url)} key={`${url}_${i}`}>
          <div>
            <a className='text'>
              <span className='url'>
                <em className='badge' data-type='Facebook'>Facebook</em> {url}
              </span>
            </a>
          </div>
        </li>
      ));
    } else {
      DOM = <li className='state-empty'>{ texts.empty }</li>;
    }
  }

  return (
    <div className={classNames(className, { 'result-facebook': true })}>
      <h3 className='t-heading'>{ texts.title }</h3>
      <ul className='entity-list result'>
      {DOM}
      </ul>
    </div>
  );
}

ResultsFacebook.defaultProps = {
  texts: {
    title: 'Check if given url related to a Facebook page',
    empty: 'No related Facebook page found for this URL',
    initial: 'Enter a URL and click "Test URL" to check if a Facebook page can be found.',
    loading: 'Testing if URL is related to a Facebook page, please wait...'
  },
  success: true,
  data: null,
  loading: false
};

ResultsFacebook.propTypes = {
  className: PropTypes.string,
  texts: PropTypes.shape({
    title: PropTypes.string.isRequired,
    empty: PropTypes.string.isRequired,
    initial: PropTypes.string.isRequired,
    loading: PropTypes.string.isRequired
  }),
  data: PropTypes.arrayOf(PropTypes.string),
  chosen: PropTypes.arrayOf(PropTypes.string).isRequired,
  loading: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};
