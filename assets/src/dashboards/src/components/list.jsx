// Import helper stuff
// ===========================================================================
import scrollbarSize from 'dom-helpers/util/scrollbarSize';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { AutoSizer, Grid } from 'react-virtualized';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { stateNum } from 'common/typecheck';

export default function DashboardList({ payload, state, deleteItem, cellRenderer }) {
  return (
     <AutoSizer>
      {({ height, width }) => (
        <Grid
          cellRenderer={({ columnIndex, key, rowIndex, style }) => cellRenderer({
            columnIndex, key, style, payload, state, deleteItem
          })}
          columnCount={payload.length}
          columnWidth={400}
          height={height}
          rowCount={1}
          rowHeight={height - scrollbarSize()}
          width={width}
        />
      )}
    </AutoSizer>
  );
}

DashboardList.propTypes = {
  state: stateNum.isRequired,
  payload: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteItem: PropTypes.func.isRequired,
  cellRenderer: PropTypes.func.isRequired
};
