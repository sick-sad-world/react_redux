// Import react stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { numBool } from 'common/typecheck';

// Import child components
// ===========================================================================
import { Favorite, Unfavorite, Refresh, Show, Hide } from 'common/components/buttons';
import Icon from 'common/components/icon';

// Result aside
// ===========================================================================
export default function ResultAside({ hash, url, favorite, ignore, refreshResult, favoriteResult, ignoreResult, className }) {
  let favoriteBtn = null;
  if (favoriteResult) {
    favoriteBtn = (favorite) ? (
      <Unfavorite onClick={() => favoriteResult({ hash, unfavorite: true })} title='Unfavorite this result' />
    ) : (
      <Favorite onClick={() => favoriteResult({ hash })} title='Favorite this result' />
    );
  }

  let ignoreBtn = null;
  if (ignoreResult) {
    ignoreBtn = (ignore) ? (
      <Show onClick={() => ignoreResult({ hash, unignore: true })} title='Unignore this result' />
    ) : (
      <Hide onClick={() => ignoreResult({ hash })} title='Ignore this result' />
    );
  }

  return (
    <div className={className}>
      {(refreshResult) ? <Refresh onClick={() => refreshResult({ hash })} title='Refresh this result' /> : null}
      {favoriteBtn}
      {ignoreBtn}
      {(url) ? <Link to={url} title='Visit original'><Icon icon='export' /></Link> : null}
    </div>
  );
}

ResultAside.defaultProps = {
  favorite: 0,
  ignore: 0
};

ResultAside.propTypes = {
  style: PropTypes.object,
  hash: PropTypes.string.isRequired,
  url: PropTypes.string,
  className: PropTypes.string,
  favorite: numBool.isRequired,
  ignore: numBool.isRequired,
  refreshResult: PropTypes.func,
  favoriteResult: PropTypes.func,
  ignoreResult: PropTypes.func
};
