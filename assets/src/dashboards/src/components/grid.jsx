import React from 'react';
import { Grid } from 'react-virtualized';
import { SortableContainer } from 'react-sortable-hoc';

class DashboardGrid extends React.Component {
  render() {
    return <Grid ref={(instance) => { this.List = instance; }} {...this.props} />;
  }
}

export default SortableContainer(DashboardGrid, { withRef: true });
