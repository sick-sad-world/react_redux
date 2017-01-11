// Import utility stuff
// ===========================================================================
import { filter } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import Column from './column';

// Main app screen - Dashboard
// ===========================================================================
class Dashboard extends React.Component {
  render() {
    let data = this.props.data;
    let empty = <section className='state-empty'>{this.props.stateEmpty}</section>;
    return (
      <section className='mod-dashboard'>
        { (this.props.state > 1) ?(data.length) ? data.map((column) => <Column key={column.id} item={column} />) : empty : null }
      </section>
    );
  }
}

// Default props for a Component
// ===========================================================================
Dashboard.defaultProps = {
  stateEmpty: 'No columns created',
  state: 1,
  data: []
};

// Take columns and results from state tree
// @deps COLUMNS
// ===========================================================================
const mapStateToProps = ({app, columns}) => ({state: app.state, data: filter(columns, (col) => !!col.open)});

export default connect(mapStateToProps)(Dashboard);