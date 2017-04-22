// Import utility stuff
// ===========================================================================
import { bindAll, includes } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { stateNum } from 'common/typecheck';
import { makeContainerSelector } from './selectors';
import { makeDropdownSelector } from 'src/columns';
import { coreInterface } from './defaults';

// Import actions
// ===========================================================================
import { editAlert, deleteAlert, createAlert } from './actions';

// Import Child components
// ===========================================================================
import DeleteConfirmation from 'common/components/delete-confirmation';
import { ListSection, ListItem } from 'common/components/list-section';
import EditAlert from './components/edit';

class Alerts extends React.Component {
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
      return this.props.editAlert(data);
    }
    delete data.id;
    return this.props.createAlert(data).then(({ payload }) => {
      this.props.router.push(`${this.props.route.path}/${payload.id}`);
    });
  }

  deleteItem(id) {
    return () => this.props.deleteAlert({ id }).then(this.deleteReset);
  }

  renderConfirmation(deleting) {
    const columns = this.props.columns.filter(({ value }) => includes(deleting.columns, value)).map(({ label }) => label);
    return (
      <dl>
        <dt>Trendolizer Alert</dt>
        <dd>{`ID: ${deleting.id} - ${deleting.name}. Watching: ${(columns.length) ? columns.join(', ') : 'none'}`}</dd>
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
          <ListItem url={this.props.route.path} current={this.props.curId} deleteText='Delete this alert' />
        </ListSection>
        {(this.props.chosen) ? (
          <EditAlert
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

Alerts.defaultProps = {
  listProps: {
    sortable: false,
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

Alerts.propTypes = {
  curId: PropTypes.number,
  state: stateNum.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(coreInterface)).isRequired,
  chosen: PropTypes.object,
  listProps: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  route: PropTypes.shape({
    path: PropTypes.string.isRequired
  }).isRequired,
  createAlert: PropTypes.func.isRequired,
  editAlert: PropTypes.func.isRequired,
  deleteAlert: PropTypes.func.isRequired
};

// Connect our Container to State
// @ deps -> Reports
// ===========================================================================
const mapStateToProps = () => {
  const selector = makeContainerSelector();
  const columns = makeDropdownSelector();
  return (state, props) => ({
    columns: columns(state, props),
    ...selector(state, props)
  });
};

const mapDispatchToProps = dispatch => (bindActionCreators({
  createAlert,
  editAlert,
  deleteAlert
}, dispatch));

export default connect(mapStateToProps(), mapDispatchToProps)(Alerts);
