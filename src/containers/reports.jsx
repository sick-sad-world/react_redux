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
import { deleteReport } from '../redux/sets';

// Import Child components
// ===========================================================================
import ListSection from '../components/listSection';
import ListItem from '../components/listItem';

class Reports extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, ['createItem', 'deleteItem']);
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
      deleting: 'Are you sure want to delete this Report?',
      empty: 'No reports created yet. Use form above to create one.'
    }
  }
};

// Connect our Container to State
// @ deps -> Reports
// ===========================================================================
const mapStateToProps = ({reports}, ownProps) => {
  let curId = parseInt(ownProps.params.id);
  let isValId = curId !== curId;
  return {
    ...reports,
    curId: (isValId) ? curId : null,
    chosen: (isValId) ? find(reports.payload, {id: curId}) : null
  }
}

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  deleteReport,
  errorHandler
}, dispatch))

export default connect(mapStateToProps, mapDispatchToProps)(Reports);