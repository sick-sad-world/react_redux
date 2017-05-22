// Import helpers
// ===========================================================================
import { includes, filter } from 'lodash';

// Import react stuff
// ===========================================================================
import React from 'react';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { defaultInterface, defaultDashboardResult } from '../defaults';

// Import child components
// ===========================================================================

import { Link } from 'react-router';
import ResultHeader from './result-header';
import ResultAside from './result-aside';
import ResultStats from './result-stats';

// description
// ===========================================================================
export default class Result extends React.PureComponent {

  inc(stat = '') {
    return includes(this.props.displaySettings, stat);
  }

  render() {
    const { location, sort, payload, style } = this.props;
    return (
      <article className='mod-result'>
        <div className='fixed' style={style}>
          <ResultHeader sort={sort} value={payload[sort]} title={payload.title} url={payload.url} />
          <ResultAside
            url={payload.url}
            hash={payload.hash}
            favorite={payload.favorite}
            ignore={payload.ignore}
            favoriteResult={this.props.favoriteResult}
            ignoreResult={this.props.ignoreResult}
            refreshResult={this.props.refreshResult}
          />
          <div className='content'>
            <Link to={`${location}/${payload.hash}`} className='result-link'>
              {(this.inc('wide_image')) ? (
                <div className='gallery'>
                  <span className='image' style={{ backgroundImage: `url(${payload.image})` }}>
                    <img src={payload.image} alt={payload.title}/>
                  </span>
                  <ResultStats domain={payload.domain} found={payload.found} />
                </div>
              ) : (
                <div className='description'>
                  <ResultStats domain={payload.domain} found={payload.found} />
                  {(this.inc('image')) ? (
                    <span className='image' style={{ backgroundImage: `url(${payload.image})` }}>
                      <img src={payload.image} alt={payload.title}/>
                    </span>
                  ) : null }
                  {payload.description}
                </div>
              )}
            </Link>
          </div>
        </div>
        {/* <footer>

        </footer>*/}
      </article>
    );
  }
}

Result.defaultProps = {
  sort: '',
  location: '',
  payload: {
    ...defaultDashboardResult
  },
  isPlaceholder: true
};

Result.propTypes = {
  isPlaceholder: PropTypes.bool.isRequired,
  sort: PropTypes.string.isRequired,
  displaySettings: PropTypes.arrayOf(PropTypes.string).isRequired,
  refreshResult: PropTypes.func,
  favoriteResult: PropTypes.func,
  ignoreResult: PropTypes.func,
  location: PropTypes.string.isRequired,
  style: PropTypes.shape({
    height: PropTypes.number.isRequired
  }).isRequired,
  payload: PropTypes.shape(defaultInterface)
};
