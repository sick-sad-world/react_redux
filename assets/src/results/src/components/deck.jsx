// Import helpers
// ===========================================================================
import { } from 'lodash';
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
import ResultMedia from './partials/image';
import ResultStats from './partials/stat-list';

function TweetDeckResult({ height, payload, location, sort, favoriteResult, ignoreResult, refreshResult }) {
  const browseUrl = `${location}?hash=${payload.hash}`;

  return (
    <article className='mod-result-tweetdeck' style={{ height: `${height}px` }}>
      <div className='content t-clear'>
        <aside>
          <ResultMedia image={payload.image} title={payload.title}/>
        </aside>
        <header>
          <time dateTime={payload.found} title={payload.found} className='t-ellipsis'>
            <Icon icon='clock' />
            <small>{moment(payload.found, foundFormat).fromNow()}</small>
          </time>
          <h1><a href={payload.url} target='_blank' >{payload.title}</a></h1>
          <a href={payload.url} target='_blank' className='ellipsis'><small>{payload.domain}</small></a>
        </header>
      </div>
      <footer>
        {(sort !== 'found') ? <ResultStats payload={payload} sort={sort} /> : null}
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

TweetDeckResult.defaultProps = {
  sort: '',
  location: '',
  payload: {
    ...defaultDashboardResult
  },
  heights: {},
  proptocolRegExp
};

TweetDeckResult.propTypes = {
  height: PropTypes.number.isRequired,
  ...defaultPropsInjected
};

export const deck = TweetDeckResult;

function TweetDeckPlaceholder({ height }) {
  return (
    <article className='mod-result-tweetdeck is-placeholder' style={{ height: `${height}px` }}>

    </article>
  );
}

TweetDeckPlaceholder.propTypes = {
  height: PropTypes.number.isRequired
};

export const deckPlaceholder = TweetDeckPlaceholder;
