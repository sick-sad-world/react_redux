// Import helper stuff
// ===========================================================================
import { bindAll } from 'lodash';
import { defaultResults } from './defaults';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { AutoSizer, List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { stateNum } from 'common/typecheck';
// import { defaultInterface } from '../defaults';

// Import connection
// ===========================================================================
import { connect } from 'react-redux';
import { makeContainerSelector } from './selectors';
import * as actions from './actions';

// Import child Components
// ===========================================================================
import Result from './components/result';
import Placeholder from './components/placeholder';

// description
// ===========================================================================
class ResultsContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.cache = new CellMeasurerCache({
      fixedWidth: true
    });
    bindAll(this, 'rowRenderer');
  }

  rowRenderer({ index, isScrolling, isVisible, key, parent, style }) {
    const result = this.props.payload[index];
    const { data, displaySettings, refreshResult, favoriteResult, ignoreResult } = this.props;
    return (
      <div key={key} style={{ ...style, padding: '0.5rem 0' }}>
        {(result && isVisible) ? (
          <Result
            payload={result}
            displaySettings={displaySettings}
            sort={data.sort}
            refreshResult={refreshResult}
            favoriteResult={favoriteResult}
            ignoreResult={ignoreResult}
          />
        ) : (
          <Placeholder displaySettings={displaySettings} />
        )}
      </div>
    );
      /* <CellMeasurer cache={this.cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
      </CellMeasurer>*/
  }

  render() {
    const { state, payload, data } = this.props;
    const rowCount = (state > 1) ? payload.length : data.limit || 30;
    // deferredMeasurementCache={this.cache}
    return (
      <AutoSizer>
        {({ height, width }) => (
          <List
            rowRenderer={this.rowRenderer}
            height={height}
            rowCount={rowCount}
            rowHeight={250}
            overscanRowCount={5}
            width={width}
          />
        )}
      </AutoSizer>
    );
  }
}

ResultsContainer.defaultProps = {
  ...defaultResults
};

ResultsContainer.propTypes = {
  id: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  displaySettings: PropTypes.arrayOf(PropTypes.string).isRequired,
  state: stateNum.isRequired,
  payload: PropTypes.arrayOf(PropTypes.object).isRequired,
  refreshResult: PropTypes.func.isRequired,
  favoriteResult: PropTypes.func.isRequired,
  ignoreResult: PropTypes.func.isRequired
};

export default connect(makeContainerSelector(), { ...actions })(ResultsContainer);
