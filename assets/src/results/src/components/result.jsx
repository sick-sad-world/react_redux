// Import helpers
// ===========================================================================
import { includes, filter } from 'lodash';
import classNames from 'classnames';
import { formatNumber, sortParamToShort } from '../helpers';

// Import react stuff
// ===========================================================================
import React from 'react';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { defaultInterface, defaultDashboardResult, proptocolRegExp } from '../defaults';

// Import child components
// ===========================================================================
import { Favorite, Unfavorite, Refresh, Show, Hide, GoTo } from 'common/components/buttons';
import { Link } from 'react-router';
import ResultHeader from './result-header';

// description
// ===========================================================================
export default class Result extends React.PureComponent {

  renderFavoriteBtn() {
    return (this.props.payload.favorite) ? (
      <Unfavorite handler={() => this.props.favoriteResult('favorite', { hash: this.props.payload.hash, unfavorite: true })} title='Unfavorite this result' />
    ) : (
      <Favorite handler={() => this.props.favoriteResult('favorite', { hash: this.props.payload.hash, unfavorite: false })} title='Favorite this result' />
    );
  }

  renderIgnoreBtn() {
    return (this.props.payload.ignore) ? (
      <Show handler={() => this.props.ignoreResult('ignore', { hash: this.props.payload.hash, unignore: true })} title='Unignore this result' />
    ) : (
      <Hide handler={() => this.props.ignoreResult('ignore', { hash: this.props.payload.hash, unignore: false })} title='Ignore this result' />
    );
  }

  render() {
    const { type, location, sort, payload, refreshResult, favoriteResult, ignoreResult, isPlaceholder } = this.props;
    return (
      <article className={classNames('mod-result', { 'is-placeholder': isPlaceholder })}>
        <aside>
          <span
            title={(sort !== 'found') ? `${sort} - ${payload[sort]}` : null}
            className={classNames('comparator', { 'with-arrow': type === 'image' })}
          >
            <span>
              <b>{(sort === 'found') ? 'Found' : formatNumber(payload[sort])}</b>
              { (sort !== 'found') ? sortParamToShort(sort) : null }
            </span>
          </span>
          <div className='btn-holder'>
            {(refreshResult) ? <Refresh handler={() => refreshResult('refresh', { hash: payload.hash })} title='Refresh this result' /> : null}
            {(favoriteResult) ? this.renderFavoriteBtn() : null }
            {(ignoreResult) ? this.renderIgnoreBtn() : null }
            <GoTo target='_blank' title='Visit original' href={payload.url} />
          </div>
        </aside>
        {(type === 'image') ? (
          <figure className='content'>
            <Link to={`${location}/${payload.hash}`} className='result-link' style={{ backgroundImage: `url(${payload.image})` }}>
              <ResultHeader title={payload.title} url={payload.url} domain={payload.domain.replace(proptocolRegExp, '')} found={payload.found} />
            </Link>
            <img src={payload.image} alt={payload.title}/>
          </figure>
        ) : (
          <div className='content'>
            <Link to={`${location}/${payload.hash}`} className='result-link'>
              <ResultHeader title={payload.title} url={payload.url} domain={payload.domain.replace(proptocolRegExp, '')} found={payload.found} />
              <div className='description'>{payload.description}</div>
            </Link>
          </div>
        )}
      </article>
    );
  }
}

Result.defaultProps = {
  sort: '',
  location: '',
  type: 'image',
  proptocolRegExp,
  payload: {
    ...defaultDashboardResult
  },
  isPlaceholder: true
};

Result.propTypes = {
  isPlaceholder: PropTypes.bool.isRequired,
  proptocolRegExp: PropTypes.instanceOf(RegExp).isRequired,
  sort: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  refreshResult: PropTypes.func,
  favoriteResult: PropTypes.func,
  ignoreResult: PropTypes.func,
  location: PropTypes.string.isRequired,
  payload: PropTypes.shape(defaultInterface)
};
