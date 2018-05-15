// Import helpers
// ===========================================================================
import includes from 'lodash/includes';
import bindAll from 'lodash/bindAll';
import moment from 'moment';

// Import react stuff
// ===========================================================================
import React from 'react';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { defaultPropsInjected, defaultDashboardResult, proptocolRegExp, customPropsInjected, foundFormat } from '../defaults';
import { BriefGraphs } from 'src/graphs';
import { decomposeColumnSort } from 'src/columns';

// Import child components
// ===========================================================================
import ResultSort from './partials/sort';
import ResultActions from './partials/actions';
import ResultTable from './partials/table';
import ResultMedia from './partials/image';

// description
// ===========================================================================
export default class CustomResult extends React.PureComponent {
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
    return (
      <article className='mod-result'>
        <aside style={{ height: heights.aside }}>
          <ResultSort sort={sort} value={payload[sort]} />
          <ResultActions
            url={browseUrl}
            hash={payload.hash}
            favorite={payload.favorite}
            ignore={payload.ignore}
            favoriteResult={this.props.favoriteResult}
            ignoreResult={this.props.ignoreResult}
            refreshResult={this.props.refreshResult}
          />
        </aside>
          {(this.isValid('title')) ? <h1 style={{ maxHeight: heights.title }}><a href={payload.url} target='_blank' >{payload.title}</a></h1> : null}
          {(this.inc('found') || this.inc('url') || this.inc('author')) ? (
            <small className='t-ellipsis' style={{ height: heights.found || heights.domain || heights.author }}>
              {(this.isValid('found')) ? <time dateTime={payload.found} className='found'>{moment(payload.found, foundFormat).fromNow()}</time> : null}
              {(this.isValid('url')) ? <a href={payload.url} target='_blank' className='domain'>{payload.domain}</a> : null}
              {(this.isValid('author')) ? <span className='author'>{payload.author}</span> : null}
            </small>
          ) : null}
          {(isImage || isDescr) ? (
            <div className='text'>
              {(this.inc('image')) ? (
                <ResultMedia wide={this.inc('wide_image')} image={payload.image} title={payload.title} style={{ height: heights.image }} />
              ) : null }
              {(isDescr) ? <div style={{ height: (this.inc('wide_image')) ? heights.description : heights.image }} className='content'>{payload.description}</div> : null}
            </div>
          ) : null}
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

CustomResult.defaultProps = {
  sort: '',
  location: '',
  payload: {
    ...defaultDashboardResult
  },
  heights: {},
  proptocolRegExp
};

CustomResult.propTypes = {
  ...defaultPropsInjected,
  ...customPropsInjected
};
