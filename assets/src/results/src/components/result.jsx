// Import helpers
// ===========================================================================
import { includes, bindAll } from 'lodash';

// Import react stuff
// ===========================================================================
import React from 'react';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { defaultInterface, defaultDashboardResult, proptocolRegExp } from '../defaults';

// Import child components
// ===========================================================================

import { Link } from 'react-router';
import ResultSort from './sort';
import ResultActions from './actions';
import ResultTable from './result/table';
import ResultMedia from './result/image';

// description
// ===========================================================================
export default class Result extends React.PureComponent {
  constructor(props) {
    super(props);
    bindAll(this, 'getTableData', 'inc', 'isValid', 'renderContent');
  }

  inc(stat = '') {
    return includes(this.props.displaySettings, stat);
  }

  isValid(stat = '') {
    const v = this.props.payload[stat];
    return (v || (typeof v === 'string' && v.length)) && this.inc(stat);
  }

  getTableData() {
    const tableRows = this.props.tableStats.filter(this.inc);
    const payload = this.props.payload;
    return (tableRows.length) ? tableRows.reduce((acc, stat) => {
      acc.push({
        title: stat,
        normal: payload[stat] || 0,
        rate: payload[`rate_${stat}`] || 0,
        maxrate: payload[`maxrate_${stat}`] || 0,
        hotness: parseFloat(payload[`hotness_${stat}`]) || 0
      });
      return acc;
    }, []) : null;
  }

  renderContent() {
    const { title, image, description } = this.props.payload;
    const heights = this.props.heights;

    if (this.inc('wide_image')) {
      return <ResultMedia image={image} title={title} style={{ height: heights.wide_image }} />;
    } else if (this.inc('description') || this.inc('image')) {
      return (
        <div className='text' style={{ maxHeight: heights.description || heights.image }}>
          {(this.inc('image')) ? (
            <ResultMedia image={image} title={title} style={{ height: heights.image }}/>
          ) : null }
          {(this.isValid('description')) ? <div className='content'>{description}</div> : null}
        </div>
      );
    }

    return null;
  }

  render() {
    const { location, sort, payload, heights } = this.props;
    const browseUrl = `${location}?hash=${payload.hash}`;
    const tableData = this.getTableData();
    return (
      <article className='mod-result'>
        <aside style={{ height: heights.aside }}>
          <ResultSort sort={sort} value={payload[sort]} />
          <ResultActions
            url={payload.url}
            hash={payload.hash}
            favorite={payload.favorite}
            ignore={payload.ignore}
            favoriteResult={this.props.favoriteResult}
            ignoreResult={this.props.ignoreResult}
            refreshResult={this.props.refreshResult}
          />
        </aside>
        <Link to={browseUrl} className='result-link'>
          {(this.isValid('title')) ? <h1 style={{ maxHeight: heights.title }}>{payload.title}</h1> : null}
          {(this.inc('found') || this.inc('domain') || this.inc('author')) ? (
            <small style={{ height: heights.found || heights.domain || heights.author }}>
              {(this.isValid('found')) ? <time dateTime={payload.found} className='found'>{payload.found}</time> : null}
              {(this.isValid('domain')) ? <span className='domain'>{payload.domain.replace(this.props.proptocolRegExp, '')}</span> : null}
              {(this.isValid('author')) ? <span className='author'>{payload.author}</span> : null}
            </small>
          ) : null}
          {this.renderContent()}
        </Link>
        {(tableData && tableData.length) ? (
          <footer>
            <ResultTable to={browseUrl} style={{ height: heights.table }} data={tableData} />
          </footer>
        ) : null }
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
  proptocolRegExp,
  isPlaceholder: true
};

Result.propTypes = {
  isPlaceholder: PropTypes.bool.isRequired,
  sort: PropTypes.string.isRequired,
  displaySettings: PropTypes.arrayOf(PropTypes.string).isRequired,
  tableStats: PropTypes.arrayOf(PropTypes.string).isRequired,
  heights: PropTypes.objectOf(PropTypes.string).isRequired,
  refreshResult: PropTypes.func,
  favoriteResult: PropTypes.func,
  ignoreResult: PropTypes.func,
  location: PropTypes.string.isRequired,
  proptocolRegExp: PropTypes.instanceOf(RegExp).isRequired,
  payload: PropTypes.shape(defaultInterface)
};
