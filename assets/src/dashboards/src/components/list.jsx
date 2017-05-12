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

export default function DashboardList({ payload, deleteItem, refreshResults, updateItem, children }) {
  return (
     <AutoSizer>
      {({ height, width }) => (
        <Grid
          cellRenderer={({ columnIndex, key, rowIndex, style }) => children({
            columnIndex, key, style, payload: payload[columnIndex], deleteItem, refreshResults, updateItem
          })}
          columnCount={payload.length}
          columnWidth={378}
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
  payload: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteItem: PropTypes.func.isRequired,
  refreshResults: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired
};
