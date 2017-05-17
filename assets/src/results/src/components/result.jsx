// Import helpers
// ===========================================================================
import { includes, filter } from 'lodash';

// Import react stuff
// ===========================================================================
import React from 'react';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { defaultInterface } from '../defaults';

// Import child components
// ===========================================================================
import { Favorite, Unfavorite, Refresh, Show, Hide } from 'common/components/buttons';
import ResultAside from './result-aside';

// description
// ===========================================================================
export default class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fulltext: false
    };
  }

  inc(t) {
    return includes(this.props.displaySettings, t);
  }

  render() {
    const { sort, payload, refreshResult, favoriteResult, ignoreResult } = this.props;
    return (
      <article className='mod-result'>
        <ResultAside sortParam={sort} sort={payload[sort]}>
          <Refresh handler={() => refreshResult('refresh', { hash: payload.hash })} title='Refresh this result' />
          {(payload.favorite) ? (
            <Unfavorite handler={() => favoriteResult('favorite', { hash: payload.hash, unfavorite: true })} title='Unfavorite this result' />
          ) : (
            <Favorite handler={() => favoriteResult('favorite', { hash: payload.hash, unfavorite: false })} title='Favorite this result' />
          )}
          {(payload.ignore) ? (
            <Show handler={() => ignoreResult('ignore', { hash: payload.hash, unignore: true })} title='Unignore this result' />
          ) : (
            <Hide handler={() => ignoreResult('ignore', { hash: payload.hash, unignore: false })} title='Ignore this result' />
          )}
        </ResultAside>
        <div className='content'>
          <header>
            { (this.inc('title')) ? <h1><a href={payload.url} target='_blank'>{payload.title}</a></h1> : null }
            { (this.inc('url')) ? <small className='t-ellipsis'>Found at: <a target='_blank' href={payload.url}>{payload.url}</a></small> : null }
            <small className='t-ellipsis'>
              { (this.inc('found')) ? <span>On: <b><time dateTime={payload.found}>{payload.found}</time></b></span> : null }
              { (this.inc('author')) ? <span>by: <b>{payload.Author}</b></span> : null }
            </small>
          </header>
        </div>
      </article>
    );
  }
}

Result.defaultProps = {
  sort: '',
  payload: null
};

Result.propTypes = {
  displaySettings: PropTypes.arrayOf(PropTypes.string).isRequired,
  sort: PropTypes.string.isRequired,
  refreshResult: PropTypes.func.isRequired,
  favoriteResult: PropTypes.func.isRequired,
  ignoreResult: PropTypes.func.isRequired,
  payload: PropTypes.shape(defaultInterface).isRequired
};
