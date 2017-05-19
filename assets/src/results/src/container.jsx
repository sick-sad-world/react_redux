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
import { } from './defaults';

// Import connection
// ===========================================================================
import { connect } from 'react-redux';
import { makeContainerSelector } from './selectors';
import * as actions from './actions';

// Import child Components
// ===========================================================================
import Result from './components/result';

// description
// ===========================================================================
class ResultsContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.infiniteRunning = false;
    bindAll(this, 'rowRenderer', 'onRowsRendered');
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
          refreshResult={this.props.refreshResult}
          favoriteResult={this.props.favoriteResult}
          ignoreResult={this.props.ignoreResult}
        />
      </div>
    );
  }

  onRowsRendered(rowCount) {
    return ({ stopIndex }) => {
      if (stopIndex > (rowCount - this.props.data.limit) && !this.infiniteRunning) {
        this.infiniteRunning = true;
        this.props.addResults({ ...this.props.data, offset: this.props.payload.length }, { id: this.props.id }).then(() => {
          this.infiniteRunning = false;
        });
      }
    };
  }

  render() {
    const { state, payload, data } = this.props;
    let rowCount = (state > 1) ? payload.length : data.limit || 30;
    if (data.infinite) {
      rowCount += data.limit;
    }
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
  ...defaultResults
};

ResultsContainer.propTypes = {
  id: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  state: stateNum.isRequired,
  payload: PropTypes.arrayOf(PropTypes.object).isRequired,
  addResults: PropTypes.func.isRequired,
  refreshResult: PropTypes.func.isRequired,
  favoriteResult: PropTypes.func.isRequired,
  ignoreResult: PropTypes.func.isRequired
};

export default connect(makeContainerSelector(), { ...actions })(ResultsContainer);
