// Import utility stuff
// ===========================================================================
import { filter } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import Column from './column';

// Import actions
// ===========================================================================
import { throwError, createData } from '../../actions/actions';

// Main app screen - Dashboard
// ===========================================================================
class Dashboard extends React.Component {
  render() {
    let columns = this.props.columns;
    let empty = <section className='state-empty'>Create new column please</section>;
    return (
      <section className='mod-dashboard'>
        { (columns.length) ? columns.map((column) => <Column key={column.id} item={column} />) : empty }
        
      </section>
    );
  }
}

// Take columns and results from state tree
// @deps COLUMNS
// ===========================================================================
const mapStateToProps = ({columns}) => ({columns: filter(columns, (col) => !!col.open)});

export default connect(mapStateToProps)(Dashboard);