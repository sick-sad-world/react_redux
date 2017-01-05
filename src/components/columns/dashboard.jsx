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
import { throwError, readData } from '../../actions/actions';

// Main app screen - Dashboard
// ===========================================================================
class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    
    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      updateData: readData('result'),
      throwError: throwError
    }, this.props.dispatch);
  }

  render() {
    let columns = this.props.columns;
    let empty = <section className='state-empty' ></section>
    return (
      <section className='mod-dashboard'>
        { (columns.length) ? columns.map((column) => <Column {...column} />) : empty }
      </section>
    );
  }
};

// Take columns and results from state tree
// ===========================================================================
const mapStateToProps = ({columns}) => ({
  columns: filter(columns, {open: 1})
})

export default connect(mapStateToProps)(Dashboard);