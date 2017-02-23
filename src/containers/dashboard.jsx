// Import utility stuff
// ===========================================================================
import { bindAll, find, defaultsDeep } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import Column from '../components/column';

// Import actions
// ===========================================================================
import { errorHandler } from '../redux/app';
import { getResults, addResults } from '../redux/results';
import { editColumn, deleteColumn, defColumn } from '../redux/columns';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, 'updateItem', 'refreshResults', 'pushResults');
  }

  createList (func) {
    if (this.props.state === 1) {
      return this.props.loadingTpl;
    } else {
      return (this.props.payload.length) ? this.props.payload.reduce(func, []) : this.props.emptyTpl;
    }
  }

  updateItem(data) {
    let column = find(this.props.payload, {id: data.id});
    if (!column) return;
    return this.props.editColumn(defaultsDeep(data, column)).then(({payload}) => {
      if (payload.open) {
        return this.props.getResults(payload.data, {id: payload.id});
      }
    }).catch(this.props.errorHandler);
  }

  refreshResults(id) {
    return (e) => {
      let column = find(this.props.payload, {id: id});
      if (column) return this.props.getResults(column.data, {id: column.id}).catch(this.props.errorHandler);
    }
  }

  pushResults(id) {
    return (offset) => {
      let column = find(this.props.payload, {id: id});
      if (column) {
        return this.props.addResults({ ...column.data, offset }, {id: column.id, state: false, notification: false}).catch(this.props.errorHandler);
      }
    }
  }

  render () {
    return (
      <div className='mod-dashboard'>
        {this.createList((acc, column) => {
          let item = (
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
            />
          );
          if (item) acc.push(item);
          return acc;
        })}
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
const mapStateToProps = ({columns}) => ({
  state: columns.state,
  payload: columns.payload.reduce((acc, col) => {
    if (col.open) {
      let item = defaultsDeep({}, col, defColumn);
      if (!item.display_settings) item.display_settings = defColumn.display_settings;
      acc.push(item);
    }
    return acc;
  }, [])
});

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  editColumn,
  deleteColumn,
  errorHandler,
  getResults,
  addResults
}, dispatch))

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);