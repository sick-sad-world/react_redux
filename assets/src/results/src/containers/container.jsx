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
import { limit, gutter, displaySettings, defaultResults } from '../defaults';

// Import connection
// ===========================================================================
import { connect } from 'react-redux';
import { makeContainerSelector } from '../selectors';
import { addResults, getResults, resultError, favoriteResult, ignoreResult, refreshResult } from '../actions';

// Import child Components
// ===========================================================================
import Result from '../components/result';
import Placeholder from '../components/placeholder';
import Icon from 'common/components/icon';

// description
// ===========================================================================
class ResultsContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
    this.infiniteRunning = false;
    this.interval = null;
    this.rowHeight = this.countRowHeight(props.displaySettings);
    this.heightConfig = this.pickElementHeights(props.displaySettings);
    this.gallery = this.isGallery(props.displaySettings);
    this.text = this.isText(props.displaySettings);
    bindAll(this, 'rowRenderer', 'onRowsRendered', 'autoreloadInitialize', 'noRowsRenderer');
    if (props.data.autoreload > 0) {
      this.interval = this.autoreloadInitialize(props.data);
    }
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

  isGallery(settings) {
    return includes(settings, 'wide_image');
  }

  isText(settings) {
    return includes(settings, 'description') && !includes(settings, 'image');
  }

  countRowHeight(settings) {
    let exclude = [];
    return settings.filter(stat => !!this.props.displaySettingsMap[stat]).reduce((acc, stat) => {
      const map = this.props.displaySettingsMap[stat];
      if (map.table && !includes(exclude, 'table')) {
        exclude.push('table');
        acc += (8 + map.height);
      }
      if (stat === 'title') {
        acc += 4;
      }
      if (map.sibling) {
        if (!includes(exclude, stat)) {
          exclude = exclude.concat(map.sibling);
          acc += map.height;
        }
      } else {
        acc += map.height;
      }
      return acc;
    }, 26);
  }

  pickElementHeights(settings) {
    return settings.reduce((acc, stat) => {
      acc[stat] = `${this.props.displaySettingsMap[stat].height}px`;
      if (!acc.table && this.props.displaySettingsMap[stat].table) {
        acc.table = acc[stat];
      }
      return acc;
    }, {
      aside: '26px'
    });
  }

  componentWillReceiveProps(newProps) {
    this.heightConfig = this.pickElementHeights(newProps.displaySettings);
    this.rowHeight = this.countRowHeight(newProps.displaySettings);
    this.gallery = this.isGallery(newProps.displaySettings);
    this.text = this.isText(newProps.displaySettings);
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

  rowRenderer({ index, isScrolling, isVisible, key, style }) {
    const result = this.props.payload[index];
    let DOM = null;
    if (this.props.state === 3 || !result) {
      DOM = <Placeholder displaySettings={this.props.displaySettings} heights={this.heightConfig} />;
    } else {
      DOM = (
        <Result
          payload={result}
          sort={this.props.data.sort}
          location={`${this.props.location}/${this.props.id}`}
          displaySettings={this.props.displaySettings}
          graphSettings={this.props.graphSettings}
          heights={this.heightConfig}
          refreshResult={this.props.refreshResult({ entity: this.props.id, state: false })}
          favoriteResult={this.props.favoriteResult({ entity: this.props.id, state: false })}
          ignoreResult={this.props.ignoreResult({ entity: this.props.id, state: false })}
        />
      );
    }

    return (
      <div key={key} style={{ ...style, padding: `${this.props.gutter}px 0` }}>{DOM}</div>
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
      if (rowCount > 0 && stopIndex > (rowCount - this.props.data.limit) && !this.infiniteRunning) {
        this.infiniteRunning = true;
        this.props.getResults({ ...this.props.data, offset: this.props.payload.length }, { entity: this.props.id, state: false }).then(() => {
          this.infiniteRunning = false;
        });
      }
    };
  }

  render() {
    const { state, payload, data } = this.props;
    const rowCount = this.countRows();
    return (
      <AutoSizer>
        {({ height, width }) => (
          <List
            length={payload.length}
            state={state}
            sort={data.sort}
            rowRenderer={this.rowRenderer}
            height={height}
            rowCount={rowCount}
            rowHeight={({ index }) => {
              const result = this.props.payload[index];
              let rowHeight = this.rowHeight;
              if (this.props.state === 2 && result && this.text && !result.description.length) {
                rowHeight -= this.props.displaySettingsMap.description.height;
              }
              return rowHeight + (this.props.gutter * 2);
            }}
            overscanRowCount={3}
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
  gutter,
  stateEmpty: 'It seems we could not find any items matching your query at this time. Try again later or modify the filter settings for this column.',
  defaultLimit: limit,
  tableStats: [...displaySettings.table],
  displaySettings: [...displaySettings.default],
  graphSettings: [...displaySettings.graph],
  displaySettingsMap: { ...displaySettings.map },
  ...defaultResults
};

ResultsContainer.propTypes = {
  id: PropTypes.number.isRequired,
  gutter: PropTypes.number.isRequired,
  defaultLimit: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  location: PropTypes.string.isRequired,
  state: stateNum.isRequired,
  error: PropTypes.string,
  stateEmpty: PropTypes.string.isRequired,
  tableStats: PropTypes.arrayOf(PropTypes.string).isRequired,
  displaySettings: PropTypes.arrayOf(PropTypes.string).isRequired,
  graphSettings: PropTypes.arrayOf(PropTypes.string).isRequired,
  displaySettingsMap: PropTypes.object.isRequired,
  payload: PropTypes.arrayOf(PropTypes.object).isRequired,
  getResults: PropTypes.func.isRequired,
  refreshResult: PropTypes.func.isRequired,
  favoriteResult: PropTypes.func.isRequired,
  ignoreResult: PropTypes.func.isRequired
};

export default connect(makeContainerSelector, dispatch => ({
  getResults(data, opts) {
    return dispatch((data.offset) ? addResults(data, opts) : getResults(data, opts)).catch(err => dispatch(resultError(err)));
  },
  favoriteResult(opts) {
    return params => dispatch(favoriteResult(params, opts));
  },
  ignoreResult(opts) {
    return params => dispatch(ignoreResult(params, opts));
  },
  refreshResult(opts) {
    return params => dispatch(refreshResult(params, opts));
  }
}))(ResultsContainer);
