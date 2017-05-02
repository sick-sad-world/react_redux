// Import utility stuff
// ===========================================================================
import { bindAll, find, includes } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { stateNum } from 'common/typecheck';
import { coreInterface } from './defaults';
import { makeDropdownSelector } from 'src/columns';
import { makeContainerSelector } from './selectors';

// Import actions
// ===========================================================================
import { bindActionCreators } from 'redux';
import { editReport, deleteReport, createReport } from './actions';

// Import Child components
// ===========================================================================
import DeleteConfirmation from 'common/components/delete-confirmation';
import { ListSection, ListItem } from 'common/components/list';
import EditReport from './components/edit';

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: null
    };
    bindAll(this, 'createItem', 'updateItem', 'deleteConfirm', 'deleteReset', 'deleteItem');
  }

  createItem(value) {
    this.props.router.push({
      pathname: `${this.props.route.path}/new`,
      query: { name: value }
    });
  }

  deleteConfirm(deleting = null) {
    return () => this.setState({ deleting });
  }

  deleteReset() {
    this.setState({ deleting: null });
  }

  updateItem(data) {
    if (data.id) {
      return this.props.editReport(data);
    }
    delete data.id;
    return this.props.createReport(data).then(({ payload }) => {
      this.props.router.push(`${this.props.route.path}/${payload.id}`);
    });
  }

  deleteItem(id) {
    return () => this.props.deleteReport({ id }).then(this.deleteReset).then(() => this.props.router.push(this.props.route.path));
  }

  renderConfirmation(deleting) {
    let text = '';
    if (this.props.columns) {
      const columns = this.props.columns.filter(({ value }) => includes(deleting.columns, value)).map(({ label }) => label);
      text = `Watching: ${(columns.length) ? columns.join(', ') : 'none'}`;
    }
    return (
      <dl>
        <dt>Trendolizer report</dt>
        <dd>{`ID: ${deleting.id} - ${deleting.name}. ${text}`}</dd>
      </dl>
    );
  }

  render() {
    const listData = {
      payload: this.props.payload,
      state: this.props.state,
      createItem: this.createItem,
      deleteItem: this.deleteConfirm,
      ...this.props.listProps
    };

    return (
      <div className='mod-page'>
        <ListSection {...listData} >
          <ListItem url={this.props.route.path} current={this.props.curId} deleteText='Delete this report' />
        </ListSection>
        {(this.props.chosen) ? (
          <EditReport
            data={this.props.chosen}
            state={this.props.state}
            current={this.props.curId}
            columns={this.props.columns}
            create={this.createItem}
            update={this.updateItem}
            backPath={this.props.route.path}
          />
        ) : null}
        {(this.state.deleting) ? (
          <DeleteConfirmation close={this.deleteReset} accept={this.deleteItem(this.state.deleting.id)}>
            {this.renderConfirmation(this.state.deleting)}
          </DeleteConfirmation>
        ) : null}
      </div>
    );
  }
}

Reports.defaultProps = {
  listProps: {
    sortable: false,
    texts: {
      title: 'Reports Management',
      description: 'Create, edit and delete reports that will be sent to you when specific columns get new items.',
      btn: 'Create new report',
      placeholder: 'Enter name',
      deleting: 'Are you sure want to delete this Report?',
      empty: 'No reports created yet. Use form above to create one.'
    }
  }
};

Reports.propTypes = {
  curId: PropTypes.number,
  state: stateNum.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired
  })),
  payload: PropTypes.arrayOf(PropTypes.shape(coreInterface)).isRequired,
  chosen: PropTypes.object,
  listProps: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  route: PropTypes.shape({
    path: PropTypes.string.isRequired
  }).isRequired,
  createReport: PropTypes.func.isRequired,
  editReport: PropTypes.func.isRequired,
  deleteReport: PropTypes.func.isRequired
};

// Connect our Container to State
// @ deps -> Reports
// ===========================================================================
function mapStateToProps() {
  const selector = makeContainerSelector();
  if (makeDropdownSelector instanceof Function) {
    const columns = makeDropdownSelector();
    return (state, props) => ({
      columns: columns(state, props),
      ...selector(state, props)
    });
  }
  return (state, props) => selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createReport,
    editReport,
    deleteReport
  }, dispatch);
}

export default connect(mapStateToProps(), mapDispatchToProps)(Reports);
