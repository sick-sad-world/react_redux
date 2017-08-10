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
import { BriefGraphs } from 'src/graphs';
import { decomposeColumnSort } from 'src/columns';

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
    bindAll(this, 'getTableData', 'inc', 'isValid');
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

  render() {
    const { location, sort, payload, heights } = this.props;
    const browseUrl = `${location}?hash=${payload.hash}`;
    const tableData = this.getTableData();
    const isImage = this.inc('image');
    const isDescr = this.isValid('description');
    const graphParam = this.inc('graphs') ? decomposeColumnSort(sort).sort_prop : null;
    // payload.domain.replace(this.props.proptocolRegExp, '')
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
              {(this.isValid('domain')) ? <a href={payload.url} target='_blank' className='domain'>{payload.domain}</a> : null}
              {(this.isValid('author')) ? <span className='author'>{payload.author}</span> : null}
            </small>
          ) : null}
          {(isImage || isDescr) ? (
            <div className='text'>
              {(this.inc('image')) ? (
                <ResultMedia
                  wide={this.inc('wide_image')}
                  image={payload.image}
                  title={payload.title}
                  style={{ height: heights.image }}
                />
              ) : null }
              {(isDescr) ? <div className='content'>{payload.description}</div> : null}
            </div>
          ) : null}
        </Link>
        {(tableData && tableData.length) ? (
          <footer>
            <ResultTable to={browseUrl} style={{ height: heights.table }} data={tableData} />
          </footer>
        ) : null }
         {graphParam ? (
          <div className='graph-container' style={{ height: heights.graphs }}>
            <BriefGraphs id={payload.id} hash={payload.hash} type={(graphParam === 'found') ? 'likes' : graphParam} />
          </div>
        ) : null}
      </article>
    );
  }
}

Result.defaultProps = {
  sort: '',
  location: '',
  emptyText: 'No description found',
  payload: {
    ...defaultDashboardResult
  },
  measure: null,
  heights: {},
  proptocolRegExp,
  isPlaceholder: true
};

Result.propTypes = {
  isPlaceholder: PropTypes.bool.isRequired,
  sort: PropTypes.string.isRequired,
  emptyText: PropTypes.string.isRequired,
  displaySettings: PropTypes.arrayOf(PropTypes.string).isRequired,
  tableStats: PropTypes.arrayOf(PropTypes.string).isRequired,
  heights: PropTypes.objectOf(PropTypes.string),
  refreshResult: PropTypes.func,
  favoriteResult: PropTypes.func,
  ignoreResult: PropTypes.func,
  measure: PropTypes.func,
  location: PropTypes.string.isRequired,
  proptocolRegExp: PropTypes.instanceOf(RegExp).isRequired,
  payload: PropTypes.shape(defaultInterface)
};
