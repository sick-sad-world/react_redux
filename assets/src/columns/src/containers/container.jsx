// Import utility stuff
// ===========================================================================
import { bindAll } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { stateNum } from 'common/typecheck';
import { coreInterface } from '../defaults';
import { makeContainerSelector } from '../selectors';

// Import actions
// ===========================================================================
import { bindActionCreators } from 'redux';
import { createColumn, editColumn, deleteColumn } from '../actions';

// Import Child components
// ===========================================================================
import DeleteConfirmation from 'common/components/delete-confirmation';
import { ListSection, ListItem } from 'common/components/list';
import { ToggleVisibility } from '../components/buttons';
import EditColumn from '../components/edit';
import ColumnFeedsAssignment from '../components/assignment';

class Columns extends React.Component {
  constructor(props) {
    super(props);
    this.state = { deleting: null };
    bindAll(this, 'createItem', 'deleteItem', 'updateItem', 'makeItemIcon', 'deleteConfirm', 'deleteReset');
  }

  deleteConfirm(deleting = null) {
    return () => this.setState({ deleting });
  }

  deleteReset() {
    this.setState({ deleting: null });
  }

  createItem(value) {
    this.props.createColumn({ name: value }).then(({ payload }) => {
      this.props.router.push(`${this.props.route.path}/${payload.id}`);
    });
  }

  updateItem(data) {
    return this.props.editColumn(data);
  }

  deleteItem(id) {
    return () => this.props.deleteColumn({ id }).then(this.deleteReset);
  }

  makeItemIcon({ id, open }) {
    return <ToggleVisibility open={open} handler={() => this.updateItem({ id, open: (open) ? 0 : 1 })} />;
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
          <ListItem url={this.props.route.path} customIcon={this.makeItemIcon} current={this.props.curId} deleteText='Delete this column' />
        </ListSection>
        {(this.props.chosen && !this.props.params.assignment) ? (
          <EditColumn
            data={this.props.chosen}
            state={this.props.state}
            update={this.updateItem}
            current={this.props.curId}
            backPath={this.props.route.path}
          />
        ) : null}
        {/* (this.props.chosen && this.props.params.assignment) ? (
          <ColumnFeedsAssignment
            data={this.props.chosen}
            state={this.props.state}
            update={this.updateItem}
            backPath={`${this.props.route.path}/${this.props.curId}`}
          />
        ) : null}*/}
        {(this.state.deleting) ? (
          <DeleteConfirmation close={this.deleteReset} accept={this.deleteItem(this.state.deleting.id)}>
            <dl>
              <dt>Trendolizer Column</dt>
              <dd>{`ID: ${this.state.deleting.id} - ${this.state.deleting.name}.`}</dd>
            </dl>
          </DeleteConfirmation>
        ) : null}
      </div>
    );
  }
}

Columns.defaultProps = {
  listProps: {
    sortable: false,
    texts: {
      title: 'Columns Management',
      description: 'Create, edit or delete dashboard columns. Drag to reorder, use the eye icon to hide/unhide them (tip: hidden columns can still be used for alerts/reports).',
      btn: 'Create new column',
      placeholder: 'New column name',
      deleting: 'Are you sure want to delete this Column?',
      empty: 'No columns created yet. Use form above to create one.'
    }
  }
};

Columns.propTypes = {
  curId: PropTypes.number,
  state: stateNum.isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(coreInterface)).isRequired,
  chosen: PropTypes.object,
  listProps: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  route: PropTypes.shape({
    path: PropTypes.string.isRequired
  }).isRequired,
  params: PropTypes.object.isRequired,
  createColumn: PropTypes.func.isRequired,
  editColumn: PropTypes.func.isRequired,
  deleteColumn: PropTypes.func.isRequired
};

// Connect our Container to State
// @ deps -> Columns
// ===========================================================================
const mapStateToProps = () => {
  const selector = makeContainerSelector();
  return (state, props) => selector(state, props);
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createColumn,
    editColumn,
    deleteColumn
  }, dispatch);
}

export default connect(mapStateToProps(), mapDispatchToProps)(Columns);
