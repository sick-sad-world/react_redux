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
import { deleteAlert } from '../redux/sets';

// Import Child components
// ===========================================================================
import ListSection from '../components/listSection';
import ListItem from '../components/listItem';

class Alerts extends React.Component {
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
    return this.props.deleteAlert({id}).catch(this.props.errorHandler);
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
          <ListItem url={this.props.route.path} deleteText='Delete this alert' />
        </ListSection>
      </div>
    )
  }
}

Alerts.defaultProps = {
  listProps: {
    sortable: false,
    deletable: true,
    texts: {
      title: 'Alerts Management',
      description: 'Create, edit and delete alerts that will be sent to you when specific columns get new items.',
      btn: 'Create new alert',
      deleting: 'Are you sure want to delete this Alert?',
      empty: 'No alerts created yet. Use form above to create one.'
    }
  }
};

// Connect our Container to State
// @ deps -> Alerts
// ===========================================================================
const mapStateToProps = ({alerts}, ownProps) => {
  let curId = parseInt(ownProps.params.id);
  let isValId = curId !== curId;
  return {
    ...alerts,
    curId: (isValId) ? curId : null,
    chosen: (isValId) ? find(alerts.payload, {id: curId}) : null
  }
}

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  deleteAlert,
  errorHandler
}, dispatch))

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);