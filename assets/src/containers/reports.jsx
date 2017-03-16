// Import utility stuff
// ===========================================================================
import { bindAll, find } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { editReport, deleteReport, defaultReport, createReport } from '../redux/reports';

// Import Child components
// ===========================================================================
import ListSection from '../components/list/section';
import ListItem from '../components/list/item';
import EditReport from '../components/edit/report';

class Reports extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, 'createItem', 'deleteItem', 'updateItem');
  }

  createItem (value) {
    this.props.router.push({
      pathname: `${this.props.route.path}/new`,
      query: {name: value}
    });
  }

  deleteItem (id) {
    return this.props.deleteReport({id});
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

  render () {

    let listData = {
      payload: this.props.payload,
      state: this.props.state,
      createItem: this.createItem,
      deleteItem: this.deleteItem,
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
const mapStateToProps = ({reports, columns}, ownProps) => {
  let curId, chosen;
  if (ownProps.params.id === 'new') {
    curId = ownProps.params.id;
    chosen = {
      ...defaultReport,
      name: ownProps.location.query.name,
      order: reports.payload.length
    };
  } else {
    curId = parseInt(ownProps.params.id);
    chosen = find(reports.payload, {id: curId});
  }
  return {
    curId,
    state: reports.state,
    payload: reports.payload.map(({id, name}) => ({id, name})),
    columns: columns.payload.map(({id, name}) => ({value: id, label: name})),
    chosen
  }
}

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  createReport,
  editReport,
  deleteReport
}, dispatch))

export default connect(mapStateToProps, mapDispatchToProps)(Reports);