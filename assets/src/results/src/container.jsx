// Import helper stuff
// ===========================================================================
import { bindAll } from 'lodash';
import { defaultResults } from './defaults';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { AutoSizer, List } from 'react-virtualized';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { stateNum } from 'common/typecheck';
import { limit } from './defaults';

// Import connection
// ===========================================================================
import { connect } from 'react-redux';
import { makeContainerSelector } from './selectors';
import { addResults, getResults, resultError, favoriteResult, ignoreResult, refreshResult } from './actions';

// Import child Components
// ===========================================================================
import Result from './components/result';
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

  componentWillReceiveProps(newProps) {
    if (newProps.data.autoreload > 0 && !this.interval) {
      this.interval = this.autoreloadInitialize(newProps.data);
    } else if (newProps.data.autoreload === 0 && this.interval) {
      this.interval();
    }
  }

  autoreloadInitialize(data) {
    this.props.getResults(data, { id: this.props.id });
    const interval = setInterval(this.props.getResults, data.autoreload * 1000, this.props.data, { id: this.props.id });
    return () => clearInterval(interval);
  }

  rowRenderer({ index, isScrolling, isVisible, key, parent, style }) {
    const result = this.props.payload[index];
    return (
      <div key={key} style={{ ...style, padding: '0.5rem 0' }}>
        <Result
          payload={result}
          sort={this.props.data.sort}
          type={this.props.type}
          location={this.props.location}
          isPlaceholder={this.props.state === 3 || !result}
          refreshResult={this.props.refreshResult({ id: this.props.id, state: false })}
          favoriteResult={this.props.favoriteResult({ id: this.props.id, state: false })}
          ignoreResult={this.props.ignoreResult({ id: this.props.id, state: false })}
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
      if (rowCount > 0 && stopIndex > (rowCount - this.props.data.limit) && !this.infiniteRunning) {
        this.infiniteRunning = true;
        this.props.getResults({ ...this.props.data, offset: this.props.payload.length }, { id: this.props.id, state: false }).then(() => {
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
            rowHeight={Math.round((width * 9) / 18)}
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
  type: 'image',
  location: '',
  stateEmpty: 'It seems we could not find any items matching your query at this time. Try again later or modify the filter settings for this column.',
  defaultLimit: limit,
  ...defaultResults
};

ResultsContainer.propTypes = {
  id: PropTypes.number.isRequired,
  defaultLimit: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  state: stateNum.isRequired,
  error: PropTypes.string,
  stateEmpty: PropTypes.string.isRequired,
  payload: PropTypes.arrayOf(PropTypes.object).isRequired,
  getResults: PropTypes.func.isRequired,
  refreshResult: PropTypes.func.isRequired,
  favoriteResult: PropTypes.func.isRequired,
  ignoreResult: PropTypes.func.isRequired
};

export default connect(makeContainerSelector(), dispatch => ({
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
