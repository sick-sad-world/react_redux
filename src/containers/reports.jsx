// Import utility stuff
// ===========================================================================
import { bindAll, find } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { errorHandler } from '../redux/app';
import { editReport, deleteReport } from '../redux/reports';

// Import Child components
// ===========================================================================
import ListSection from '../components/listSection';
import ListItem from '../components/listItem';
import EditReport from '../components/edit/report';

class Reports extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, 'createItem', 'deleteItem', 'updateItem');
  }

  createItem (value) {
    this.props.router.push({
      pathname: this.props.route.path+'/new',
      query: {name: value}
    });
  }

  deleteItem (id) {
    return this.props.deleteReport({id}).catch(this.props.errorHandler);
  }

  updateItem (data) {
    return this.props.editReport(data).catch(this.props.errorHandler);
  }

  render () {

    let listData = {
      payload: this.props.payload.map(({id, name}) => ({id, name})),
      state: this.props.state,
      createItem: this.createItem,
      deleteItem: this.deleteItem,
      ...this.props.listProps
    }

    return (
      <div className='mod-page'>
        <ListSection {...listData} >
          <ListItem url={this.props.route.path} deleteText='Delete this report' />
        </ListSection>
        {(this.props.chosen) ? (
          <EditReport data={this.props.chosen} state={this.props.state} columns={this.props.columns} update={this.updateItem} backPath={this.props.route.path} />
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
  return {
    ...reports,
    columns: columns.payload.map(({id, name}) => ({value: id, label: name})),
    chosen: find(reports.payload, {id: parseInt(ownProps.params.id)})
  }
}

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  editReport,
  deleteReport,
  errorHandler
}, dispatch))

export default connect(mapStateToProps, mapDispatchToProps)(Reports);