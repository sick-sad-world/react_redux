// Import helper stuff
// ===========================================================================
import { bindAll, includes } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { AutoSizer, List } from 'react-virtualized';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { stateNum } from 'common/typecheck';
import { limit, defaultResults } from '../defaults';
import DisplaySettings, { dsValueShape } from 'src/display-settings';

// Import connection
// ===========================================================================
import { connect } from 'react-redux';
import { makeContainerSelector } from '../selectors';
import { fetchResults, favoriteResult, ignoreResult, refreshResult } from '../actions';

// Import child Components
// ===========================================================================
import * as ResultComponents from '../components';
import Icon from 'common/components/icon';

// Container wich renders Results list in each column in Dashboard
// ===========================================================================
class ResultsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
    this.infiniteloading = false;
    this.interval = null;
    this.updateHeightStatus(props.displaySettings);

    bindAll(this, 'rowRenderer', 'onRowsRendered', 'autoreloadInitialize', 'noRowsRenderer', 'countRowHeight');
    if (props.data.autoreload > 0) {
      this.interval = this.autoreloadInitialize(props.data);
    }
  }

  updateHeightStatus(ds) {
    this.rowHeight = DisplaySettings.calculateHeight(ds);
    this.resultType = DisplaySettings.getHeights(ds);
  }

  countRows() {
    const { data, payload } = this.props;
    let result = this.props.defaultLimit;
    switch (this.props.state) {
      case 0:
        result = 0;
        break;
      case 1:
      case 3:
        result = data.limit;
        break;
      default:
        result = payload.length;
        if (data.infinite && payload.length) {
          result += data.limit;
        }
        break;
    }
    return result;
  }

  componentWillReceiveProps(newProps) {
    this.updateHeightStatus(newProps.displaySettings);

    if (newProps.state === 2 && (typeof this.rowHeight !== 'number')) {
      this.List.recomputeRowHeights();
    }

    if (newProps.data.autoreload > 0 && !this.interval) {
      this.interval = this.autoreloadInitialize(newProps.data);
    } else if (newProps.data.autoreload === 0 && this.interval) {
      this.interval();
    }
  }

  autoreloadInitialize(data) {
    this.props.getResults(data, { id: this.props.id });
    const interval = setInterval(this.props.getResults, data.autoreload * 1000, this.props.data, { entity: this.props.id });
    return () => clearInterval(interval);
  }

  getRequiredData(index) {
    return {
      location: `${this.props.location}/${this.props.id}`,
      sort: this.props.data.sort,
      refreshResult: this.props.refreshResult,
      favoriteResult: this.props.favoriteResult,
      ignoreResult: this.props.ignoreResult
    };
  }

  getCustomData() {
    return {
      displaySettings: this.props.displaySettings,
      tableStats: this.props.tableStats,
      heights: this.resultType
    };
  }

  rowRenderer({ index, isScrolling, isVisible, key, style }) {
    const result = this.props.payload[index];
    const componentType = (typeof this.resultType === 'string') ? this.resultType : 'Custom';
    const isPlaceholder = (this.props.state === 3 || !result) ? 'Placeholder' : '';

    const Component = ResultComponents[`${componentType}${isPlaceholder}`];
    const requiredData = (!isPlaceholder) ? this.getRequiredData(index) : {};
    const customData = (componentType === 'Custom') ? this.getCustomData() : { height: this.rowHeight };

    return (
      <div key={key} style={{ ...style, padding: `${this.props.gutter * 1}px 4px ${this.props.gutter * 1.5}px` }}>
        <Component
          payload={result}
          {...requiredData}
          {...customData}
        />
      </div>
    );
  }

  noRowsRenderer() {
    if (this.props.error) {
      return (
        <div className='state-error'>
          <Icon icon='error' viewBox='0 0 24 24' />
          {this.props.error}
        </div>
      );
    }
    return (
      <div className='state-empty'>
        <Icon icon='warning' viewBox='0 0 24 24' />
        {this.props.stateEmpty}
      </div>
    );
  }

  onRowsRendered(rowCount) {
    return ({ stopIndex }) => {
      if (stopIndex > 2 && rowCount > 0 && stopIndex > (rowCount - this.props.data.limit) && !this.infiniteloading && this.props.state === 2) {
        this.infiniteloading = true;
        this.props.getResults({ ...this.props.data, offset: this.props.payload.length }, { entity: this.props.id, state: false }).then(() => {
          this.infiniteloading = false;
        });
      }
    };
  }

  countRowHeight({ index }) {
    const ds = this.props.displaySettings;
    const result = this.props.payload[index];
    const isSolutionCount = includes(ds, 'description') && (includes(ds, 'wide_image') || !includes(ds, 'image'));
    return this.rowHeight({
      title: (result) ? result.title : !result,
      description: (isSolutionCount && result) ? result.description : !result
    });
  }

  render() {
    const { state, payload, data, width } = this.props;
    const rowCount = this.countRows();
    return (
      <AutoSizer disableWidth>
        {({ height }) => (
          <List
            ref={(instance) => { this.List = instance; }}
            length={payload.length}
            state={state}
            sort={data.sort}
            rowRenderer={this.rowRenderer}
            height={height}
            rowCount={rowCount}
            rowHeight={(typeof this.rowHeight === 'number') ? this.rowHeight : this.countRowHeight}
            overscanRowCount={2}
            width={width}
            noRowsRenderer={this.noRowsRenderer}
            onRowsRendered={(data.infinite) ? this.onRowsRendered(rowCount) : undefined}
          />
        )}
      </AutoSizer>
    );
  }
}

ResultsContainer.defaultProps = {
  location: '',
  stateEmpty: 'It seems we could not find any items matching your query at this time. Try again later or modify the filter settings for this column.',
  defaultLimit: limit,
  gutter: DisplaySettings.gutter,
  tableStats: DisplaySettings.getTable(),
  displaySettings: DisplaySettings.getDefault(),
  displaySettingsMap: DisplaySettings.getRaw(),
  ...defaultResults
};

ResultsContainer.propTypes = {
  id: PropTypes.number.isRequired,
  defaultLimit: PropTypes.number.isRequired,
  gutter: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  location: PropTypes.string.isRequired,
  state: stateNum.isRequired,
  error: PropTypes.string,
  width: PropTypes.number.isRequired,
  stateEmpty: PropTypes.string.isRequired,
  tableStats: PropTypes.arrayOf(PropTypes.string).isRequired,
  displaySettings: dsValueShape.isRequired,
  displaySettingsMap: PropTypes.object.isRequired,
  payload: PropTypes.arrayOf(PropTypes.object).isRequired,
  getResults: PropTypes.func.isRequired,
  refreshResult: PropTypes.func.isRequired,
  favoriteResult: PropTypes.func.isRequired,
  ignoreResult: PropTypes.func.isRequired
};

export default connect(makeContainerSelector, (dispatch, { id }) => ({
  getResults(data, opts) {
    return dispatch(fetchResults(data, opts));
  },
  favoriteResult(params) {
    return dispatch(favoriteResult(params, { entity: id, state: false }));
  },
  ignoreResult(params) {
    return dispatch(ignoreResult(params, { entity: id, state: false }));
  },
  refreshResult(params) {
    return dispatch(refreshResult(params, { entity: id, state: false }));
  }
}))(ResultsContainer);
