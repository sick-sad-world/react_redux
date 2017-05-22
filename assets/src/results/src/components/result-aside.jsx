// Import react stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { numBool } from 'common/typecheck';

// Import child components
// ===========================================================================
import { Favorite, Unfavorite, Refresh, Show, Hide, GoTo } from 'common/components/buttons';

// Result aside
// ===========================================================================
export default function ResultAside({ hash, url, favorite, ignore, refreshResult, favoriteResult, ignoreResult }) {
  let favoriteBtn = null;
  if (favoriteResult) {
    favoriteBtn = (favorite) ? (
      <Unfavorite handler={() => favoriteResult({ hash, unfavorite: true })} title='Unfavorite this result' />
    ) : (
      <Favorite handler={() => favoriteResult({ hash })} title='Favorite this result' />
    );
  }

  let ignoreBtn = null;
  if (ignoreResult) {
    ignoreBtn = (ignore) ? (
      <Show handler={() => ignoreResult({ hash, unignore: true })} title='Unignore this result' />
    ) : (
      <Hide handler={() => ignoreResult({ hash })} title='Ignore this result' />
    );
  }

  return (
    <aside>
      {(refreshResult) ? <Refresh handler={() => refreshResult({ hash })} title='Refresh this result' /> : null}
      {favoriteBtn}
      {ignoreBtn}
      <GoTo target='_blank' title='Visit original' href={url} />
    </aside>
  );
}

ResultAside.defaultProps = {
  favorite: 0,
  ignore: 0
};

ResultAside.propTypes = {
  hash: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  favorite: numBool.isRequired,
  ignore: numBool.isRequired,
  refreshResult: PropTypes.func,
  favoriteResult: PropTypes.func,
  ignoreResult: PropTypes.func
};
