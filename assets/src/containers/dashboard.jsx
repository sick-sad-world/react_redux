// Import utility stuff
// ===========================================================================
import { bindAll, find } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { makeDashboardSelector } from '../selectors/columns';

// Import Child components
// ===========================================================================
import Header from '../components/dashboard/header';
import Settings from '../components/dashboard/settings';
import DeleteConfirmation from '../components/delete-confirm';
import Results from '../components/dashboard/results';

// Import actions
// ===========================================================================
import { getResults, addResults } from '../redux/results';
import { editColumn, deleteColumn } from '../redux/columns';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: null,
      payload: props.payload
    }
    bindAll(this, 'refreshResults', 'renderItem', 'updateItem', 'deleteConfirm', 'deleteReset');
  }

  deleteConfirm (deleting = null) {
    return () => this.setState({deleting});
  }

  deleteReset () {
    this.setState({deleting: null})
  }

  deleteItem (id) {
    return () => this.props.deleteColumn({id}).then(this.deleteReset);
  }

  isRootPath (props) {
    return props.location.pathname === '/';
  }

  componentWillReceiveProps(newProps) {
    let isRoot = this.isRootPath(newProps);
    this.setState({
      deleting: (isRoot) ? this.state.deleting : 0,
      expanded: (isRoot) ? this.state.expanded : 0,
      payload: newProps.payload
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.isRootPath(nextProps);
  }

  updateItem(id) {
    return (changes) => {
      let column = find(this.props.payload, {id});
      if (column) {
        changes.data = {...column.data, ...changes.data};
        this.props.editColumn(changes).then(({payload}) => {
          if (changes.data.sort || changes.data.direction) {
            return this.props.getResults(payload.data, {id: changes.id});
          }
        });
      }
    }
  }

  hideItem(id) {
    return () => this.props.editColumn({id, open: 0});
  }

  refreshResults(id) {
    return (e) => {
      let column = find(this.props.payload, {id});
      if (column) return this.props.getResults(column.data, {id: column.id});
    }
  }

  fetchResults(id) {
    return (offset) => {
      let column = find(this.props.payload, {id});
      if (column) {
        if (offset) {
          return this.props.addResults({...column.data, offset}, {id, state: false})
        } else {
          return this.props.getResults({...column.data}, {id})
        }
      } else {
        return new Promise().resolve();
      }
    }
  }

  toggleEditing(e) {
    let target = e.target;
    while (!target.classList.contains('mod-column')) {
      target = target.parentElement;
    }
    target.classList.toggle('is-expanded');
  }

  renderConfirmation (deleting) {
    return (
      <dl>
        <dt>Trendolizer Column</dt>
        <dd>{`ID: ${deleting.id} - ${deleting.name}.`}</dd>
      </dl>
    );
  }

  renderItem (column) {
    return (
      <section key={column.id} className='mod-column'>
        <Header name={column.name} refresh={this.refreshResults(column.id)} settings={this.toggleEditing} />
        <Settings
          id={column.id}
          running={this.props.state > 2}
          onChange={this.updateItem(column.id)}
          hideItem={this.hideItem(column.id)}
          deleteItem={this.deleteConfirm(column)}
          sort={column.data.sort}
          direction={column.data.direction}
          infinite={column.data.infinite}
          autoreload={column.data.autoreload}
        />
        <Results
          id={column.id}
          infinite={column.data.infinite}
          autoreload={column.data.autoreload}
          display_settings={column.display_settings}
          sort={column.data.sort}
          getResults={this.fetchResults(column.id)}
        />
      </section>
    );
  }

  render () {
    return (
      <div className='mod-dashboard'>
        {(this.props.state === 1) ? 
          this.props.loadingTpl : 
            (this.state.payload.length) ? 
              this.state.payload.map(this.renderItem) : 
                this.props.emptyTpl }
        {(this.state.deleting) ? (
          <DeleteConfirmation close={this.deleteReset} accept={this.deleteItem(this.state.deleting.id)}>
            {this.renderConfirmation(this.state.deleting)}
          </DeleteConfirmation>
        ) : null}
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

const mapDispatchToProps = (dispatch) => bindActionCreators({
  deleteColumn,
  editColumn,
  getResults,
  addResults
}, dispatch);

export default connect(mapStateToProps(), mapDispatchToProps)(Dashboard);