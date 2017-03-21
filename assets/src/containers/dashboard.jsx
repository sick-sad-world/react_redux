// Import utility stuff
// ===========================================================================
import { bindAll, find, defaultsDeep } from 'lodash';


// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { makeDashboardSelector } from '../selectors/columns';

// Import Child components
// ===========================================================================
import Column from '../components/column';

// Import actions
// ===========================================================================
import { getResults, addResults } from '../redux/results';
import { editColumn, deleteColumn } from '../redux/columns';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    //console.log('Dashboard mount');
    bindAll(this, 'updateItem', 'refreshResults', 'pushResults', 'deleteItem');
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.location.pathname === '/';
  }

  createList (func) {
    if (this.props.state === 1) {
      return this.props.loadingTpl;
    } else {
      return (this.props.payload.length) ? this.props.payload.map(func) : this.props.emptyTpl;
    }
  }

  updateItem(data) {
    let column = find(this.props.payload, {id: data.id});
    if (!column) return;
    let shouldRefresh = data.data.sort !== column.data.sort || data.data.direction !== column.data.direction;
    return this.props.editColumn(defaultsDeep(data, column)).then(({payload}) => {
      if (payload.open && shouldRefresh) {
        return this.props.getResults(payload.data, {id: payload.id});
      }
    });
  }

  refreshResults(id) {
    return (e) => {
      let column = find(this.props.payload, {id: id});
      if (column) return this.props.getResults(column.data, {id: column.id});
    }
  }

  pushResults(id) {
    return (offset) => {
      let column = find(this.props.payload, {id: id});
      if (column) return this.props.addResults({
        ...column.data,
        offset
      }, {
        id: column.id,
        state: false,
        notification: false
      });
    }
  }

  deleteItem(id) {
    this.props.deleteColumn({id});
  }

  render () {
    console.log('Dashboard render');
    return (
      <div className='mod-dashboard'>
        {this.createList((acc, column) => (
          <Column
            key={column.id}
            id={column.id}
            name={column.name}
            open={column.open}
            display_settings={column.display_settings}
            infinite={column.data.infinite}
            autoreload={column.data.autoreload}
            direction={column.data.direction}
            sort={column.data.sort}
            state={this.props.state}
            onChange={this.updateItem}
            onScroll={this.pushResults(column.id)}
            onClick={this.refreshResults(column.id)}
            deleteItem={this.deleteItem}
          />
        ))}
      </div>
    )
  }
}

Dashboard.defaultProps = {
  emptyTpl: <section className='state-empty'>No columns created</section>,
  loadingTpl: <section className='state-loading'>Loading...</section>
}

// Connect our Container to State
// @ deps -> Columns
// ===========================================================================
const mapStateToProps = () => {
  const selector = makeDashboardSelector();
  return (state, props) => selector(state, props)
}

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  editColumn,
  deleteColumn,
  getResults,
  addResults
}, dispatch))

export default connect(mapStateToProps(), mapDispatchToProps)(Dashboard);