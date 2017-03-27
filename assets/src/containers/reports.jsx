// Import utility stuff
// ===========================================================================
import { bindAll, find, includes } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { makeContainerSelector } from '../selectors/reports';
import { makeDropdownSelector } from '../selectors/columns';

// Import actions
// ===========================================================================
import { editReport, deleteReport, createReport } from '../redux/reports';

// Import Child components
// ===========================================================================
import DeleteConfirmation from '../components/delete-confirm';
import ListSection from '../components/list/section';
import ListItem from '../components/list/item';
import EditReport from '../components/edit/report';

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: null
    }
    bindAll(this, 'createItem', 'updateItem', 'deleteConfirm', 'deleteReset', 'deleteItem');
  }

  createItem (value) {
    this.props.router.push({
      pathname: `${this.props.route.path}/new`,
      query: {name: value}
    });
  }

  deleteConfirm (deleting = null) {
    return () => this.setState({deleting});
  }

  deleteReset () {
    this.setState({deleting: null})
  }

  updateItem (data) {
    if (data.id) {
      return this.props.editReport(data);
    } else {
      delete data.id;
      return this.props.createReport(data).then(({payload}) => {
        this.props.router.push(`${this.props.route.path}/${payload.id}`)
      });
    }
  }

  deleteItem (id) {
    return () => this.props.deleteReport({id}).then(this.deleteReset);
  }

  renderConfirmation (deleting) {
    let columns = this.props.columns.filter(({value}) => includes(deleting.columns, value)).map(({name}) => name);
    return (
      <dl>
        <dt>Trendolizer report</dt>
        <dd>{`ID: ${deleting.id} - ${deleting.name}. Watching: ${(columns.length) ? columns.join(', ') : 'none'}`}</dd>
      </dl>
    )
  }

  render () {

    let listData = {
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
    )
  }
}

Reports.defaultProps = {
  listProps: {
    sortable: false,
    deletable: true,
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

// Connect our Container to State
// @ deps -> Reports
// ===========================================================================
const mapStateToProps = () => {
  let selector = makeContainerSelector();
  let columns = makeDropdownSelector();
  return (state, props) => ({
    ...selector(state, props),
    columns: columns(state, props)
  });
}

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  createReport,
  editReport,
  deleteReport
}, dispatch))

export default connect(mapStateToProps(), mapDispatchToProps)(Reports);