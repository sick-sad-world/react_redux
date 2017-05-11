// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';
import { AutoSizer, CellMeasurer, Grid } from 'react-virtualized';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { defaultInterface } from '../defaults';
import { makeContainerSelector } from '../selectors';

function Dashboard({ payload, emptyTpl }) {
  return (
    <section className='mod-dashboard'>
      <AutoSizer>
        {({ height, width }) => (
          <CellMeasurer
            cellRenderer={yourCellRenderer}
            columnCount={numColumns}
            rowCount={numRows}
            width={800}
          >
            {({ getRowHeight }) => (
              <Grid
                cellRenderer={({ columnIndex, isScrolling, rowIndex }) => <div/>}
                columnCount={numColumns}
                columnWidth={100}
                height={height}
                rowCount={1}
                rowHeight={height}
                width={800}
              />
            )}
          </CellMeasurer>
        )}
      </AutoSizer>
    {(!payload) ? emptyTpl : JSON.stringify(payload)}
    </section>
  );
}

Dashboard.defaultProps = {
  emptyTpl: <div className='state-empty'>Oups... Dashboard not found</div>
};

Dashboard.propTypes = {
  payload: PropTypes.shape(defaultInterface),
  emptyTpl: PropTypes.element.isRequired
};

// Connect our Container to State
// @ deps -> Dashboards
// ===========================================================================
function mapStateToProps() {
  const selector = makeContainerSelector();
  return (state, props) => selector(state, props);
}

export default connect(mapStateToProps())(Dashboard);
