// Import helpers
// ===========================================================================
import moment from 'moment';

// Import react stuff
// ===========================================================================
import React from 'react';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { defaultPropsInjected, defaultDashboardResult, proptocolRegExp, foundFormat } from '../defaults';

// Import child components
// ===========================================================================
import Icon from 'common/components/icon';
import ResultActions from './partials/actions';
import ResultSort from './partials/sort';

function ShortResult({ height, payload, location, sort, favoriteResult, ignoreResult, refreshResult }) {
  const browseUrl = `${location}?hash=${payload.hash}`;

  return (
    <article className='mod-result-short' style={{ height: `${height}px` }}>
      <div className='content t-clear'>
        <ResultSort sort={sort} value={payload[sort]} className='sort'/>
        <header>
          <small className='t-ellipsis'>
            <time dateTime={payload.found} title={payload.found}>
              <Icon icon='clock' />
              {moment(payload.found, foundFormat).fromNow()}
            </time>
            <a href={payload.url} target='_blank' >{payload.domain}</a>
          </small>
          <h1><a href={payload.url} target='_blank' >{payload.title}</a></h1>
        </header>
      </div>
      <footer>
        <ResultActions
          url={browseUrl}
          hash={payload.hash}
          favorite={payload.favorite}
          ignore={payload.ignore}
          className='actions'
          favoriteResult={favoriteResult}
          ignoreResult={ignoreResult}
          refreshResult={refreshResult}
        />
      </footer>
    </article>
  );
}

ShortResult.defaultProps = {
  sort: '',
  location: '',
  payload: {
    ...defaultDashboardResult
  },
  heights: {},
  proptocolRegExp
};

ShortResult.propTypes = {
  height: PropTypes.number.isRequired,
  ...defaultPropsInjected
};

export const short = ShortResult;

function ShortPlaceholder({ height }) {
  return (
    <article className='mod-result-short is-placeholder' style={{ height: `${height}px` }}>
      <div className='t-clear content'>
        <aside>
          <div className='sort'></div>
        </aside>
        <header>
          <span className='line very-short'></span>
          <span className='line'></span>
          <span className='line'></span>
        </header>
      </div>
      <footer>
        <div className='actions'>
          <span className='circle'></span>
          <span className='circle'></span>
          <span className='circle'></span>
          <span className='circle'></span>
        </div>
      </footer>
    </article>
  );
}

ShortPlaceholder.propTypes = {
  height: PropTypes.number.isRequired
};

export const shortPlaceholder = ShortPlaceholder;
