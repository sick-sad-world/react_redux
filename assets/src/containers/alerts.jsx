// Import utility stuff
// ===========================================================================
import { bindAll, find, includes } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { notification } from '../redux/notifications';
import { editAlert, deleteAlert, createAlert, defaultAlert } from '../redux/alerts';

// Import Child components
// ===========================================================================
import DeleteConfirmation from '../components/delete-confirm';
import ListSection from '../components/list/section';
import ListItem from '../components/list/item';
import EditAlert from '../components/edit/alert';

class Alerts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: null
    }
    bindAll(this, 'createItem', 'updateItem', 'deleteItem', 'deleteConfirm', 'deleteReset');
  }

  deleteConfirm (deleting = null) {
    return () => this.setState({deleting});
  }

  deleteReset () {
    this.setState({deleting: null})
  }

  createItem (value) {
    this.props.router.push({
      pathname: `${this.props.route.path}/new`,
      query: {name: value}
    });
  }

  updateItem (data) {
    if (data.id) {
      return this.props.editAlert(data);
    } else {
      delete data.id;
      return this.props.createAlert(data).then(({payload}) => {
        this.props.router.push(`${this.props.route.path}/${payload.id}`)
      });
    }
  }

  deleteItem (id) {
    return () => this.props.deleteAlert({id}).then(this.deleteReset);
  }

  renderConfirmation (deleting) {
    let columns = this.props.columns.filter(({value}) => includes(deleting.columns, value)).map(({name}) => name);
    return (
      <dl>
        <dt>Trendolizer alert</dt>
        <dd>{`ID: ${deleting.id} - ${deleting.name}. Watching: ${(columns.length) ? columns.join(', ') : 'none'}`}</dd>
      </dl>
    );
  }

  render () {
    let listData = {
      payload: this.props.payload,
      state: this.props.state,
      createItem: this.createItem,
      deleteItem: this.deleteConfirm,
      ...this.props.listProps
    }
    return (
      <div className='mod-page'>
        <ListSection {...listData} >
          <ListItem url={this.props.route.path} current={this.props.curId} deleteText='Delete this alert' />
        </ListSection>
        {(this.props.chosen) ? (
          <EditAlert
            data={this.props.chosen}
            state={this.props.state}
            current={this.props.curId}
            columns={this.props.columns}
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

Alerts.defaultProps = {
  listProps: {
    sortable: false,
    deletable: true,
    texts: {
      title: 'Alerts Management',
      description: 'Create, edit and delete alerts that will be sent to you when specific columns get new items.',
      btn: 'Create new alert',
      placeholder: 'Enter name',
      deleting: 'Are you sure want to delete this Alert?',
      empty: 'No alerts created yet. Use form above to create one.'
    }
  }
};

// Connect our Container to State
// @ deps -> Alerts
// ===========================================================================
const mapStateToProps = ({alerts, columns}, ownProps) => {
  let curId, chosen;
  if (ownProps.params.id === 'new') {
    curId = ownProps.params.id;
    chosen = {
      ...defaultAlert,
      name: ownProps.location.query.name,
      order: alerts.payload.length
    };
  } else {
    curId = parseInt(ownProps.params.id);
    chosen = find(alerts.payload, {id: curId});
  }
  return {
    curId,
    state: alerts.state,
    payload: alerts.payload.map(({id, name}) => ({id, name})),
    columns: columns.payload.map(({id, name}) => ({value: id, label: name})),
    chosen
  }
}

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  createAlert,
  deleteAlert,
  editAlert,
  notification
}, dispatch))

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);