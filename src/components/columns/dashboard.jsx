// Import utility stuff
// ===========================================================================
import { reduce, defaultsDeep } from 'lodash';
import classNames from 'classnames';
import { ensureColumnData } from '../../helpers/functions';
import { defColumn, defColumnParameters } from '../../helpers/defaults';

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
        { (data.length) ? data.map((column) => <Column key={column.id} item={column} />) : empty }
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
const mapStateToProps = ({app, columns}) => ({
  state: app.state,
  data: reduce(columns, (acc, column) => {
    if (column.open) {
      acc.push(ensureColumnData(column, defColumn))
    }
    return acc;
  }, [])
});

export default connect(mapStateToProps)(Dashboard);