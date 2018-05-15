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
import ResultMedia from './partials/image';
import ResultStats from './partials/stat-list';

function GalleryResult({ height, payload, location, sort, favoriteResult, ignoreResult, refreshResult }) {
  const browseUrl = `${location}?hash=${payload.hash}`;

  return (
    <article className='mod-result-gallery' style={{ height: `${height}px` }}>
      <ResultMedia image={payload.image} title={payload.title}/>
      {(sort !== 'found') ? <ResultStats payload={payload} sort={sort} /> : null}
      <header>
        <h1><a href={payload.url} target='_blank' >{payload.title}</a></h1>
        <small className='t-ellipsis'>
          <time dateTime={payload.found} title={payload.found}>
            <Icon icon='clock' />
            {moment(payload.found, foundFormat).fromNow()}
          </time>
          <a href={payload.url} target='_blank' >{payload.domain}</a>
        </small>
      </header>
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
    </article>
  );
}

GalleryResult.defaultProps = {
  sort: '',
  location: '',
  payload: {
    ...defaultDashboardResult
  },
  heights: {},
  proptocolRegExp
};

GalleryResult.propTypes = {
  height: PropTypes.number.isRequired,
  ...defaultPropsInjected
};

export const gallery = GalleryResult;

function GalleryPlaceholder({ height }) {
  return (
    <article className='mod-result-gallery is-placeholder' style={{ height: `${height}px` }}>
      <div className='image'></div>
      <div className='actions'>
        <span className='circle'></span>
        <span className='circle'></span>
        <span className='circle'></span>
        <span className='circle'></span>
      </div>
    </article>
  );
}

GalleryPlaceholder.propTypes = {
  height: PropTypes.number.isRequired
};

export const galleryPlaceholder = GalleryPlaceholder;
