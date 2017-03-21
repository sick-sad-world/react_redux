// Import utility stuff
// ===========================================================================
import { bindAll, find, some, includes } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { getResults } from '../redux/results';
import { makeContainerSelector } from '../selectors/columns';
import { createColumn, editColumn, deleteColumn } from '../redux/columns';

// Import Child components
// ===========================================================================
import Icon from '../components/icon';
import ListSection from '../components/list/section';
import ListItem from '../components/list/item';
import EditColumn from '../components/edit/column';
import AssignFeedsToColumn from '../components/edit/feeds-assignment';

class Columns extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, 'createItem', 'deleteItem', 'updateItem', 'makeItemIcon');
  }

  createItem (value) {
    this.props.createColumn({ name: value }).then(({payload}) => {
      this.props.router.push(`${this.props.route.path}/${payload.id}`);
      if (payload.open) {
        return this.props.getResults(payload.data, {id: payload.id});
      }
    });
  }

  updateItem(data, changed) {
    return this.props.editColumn(data).then(({payload}) => {
      if (some(changed, (v) => !includes(this.props.notRelatedProps, v))) {
        return this.props.getResults(payload.data, {id: payload.id});
      }
    });
  }

  deleteItem (id) {
    return this.props.deleteColumn({id});
  }

  makeItemIcon (props) {
    let { id, open } = props;
    let visIconData = this.props.visIconData;
    return (
      <a onClick={() => this.updateItem({id, open: (open) ? 0 : 1})} title={visIconData[open].title}>
        <Icon icon={visIconData[open].icon} />
      </a>
    );
  }

  render () {
    console.log('render');
    let Edit = null;
    let listData = {
      curId: this.props.curId,
      payload: this.props.payload,
      state: this.props.state,
      createItem: this.createItem,
      deleteItem: this.deleteItem,
      ...this.props.listProps
    }
    
    if (this.props.chosen && this.props.curId) {
      if (this.props.params.assignment) {
        Edit = <AssignFeedsToColumn
          data={this.props.chosen}
          state={this.props.state}
          update={this.updateItem}
          backPath={`${this.props.route.path}/${this.props.curId}`}
        />;
      } else {
        Edit = <EditColumn
          data={this.props.chosen}
          state={this.props.state}
          update={this.updateItem}
          current={this.props.curId}
          backPath={this.props.route.path}
        />;
      }
    }

    return (
      <div className='mod-page'>
        <ListSection {...listData} >
          <ListItem url={this.props.route.path} customIcon={this.makeItemIcon} current={this.props.curId} deleteText='Delete this column' />
        </ListSection>
        {Edit}
      </div>
    )
  }
}

Columns.defaultProps = {
  listProps: {
    sortable: false,
    deletable: true,
    texts: {
      title: 'Columns Management',
      description: 'Create, edit or delete dashboard columns. Drag to reorder, use the eye icon to hide/unhide them (tip: hidden columns can still be used for alerts/reports).',
      btn: 'Create new column',
      deleting: 'Are you sure want to delete this Column?',
      empty: 'No columns created yet. Use form above to create one.'
    }
  },
  notRelatedProps: ['name', 'display_settings', 'infinite', 'autoreload'],
  visIconData: [{icon: 'eye', title: 'Show this column'}, {icon: 'eye-with-line', title: 'Hide this column'}]
};

// Connect our Container to State
// @ deps -> Columns
// ===========================================================================
const mapStateToProps = () => {
  const selector = makeContainerSelector();
  return (state, props) => selector(state, props)
}

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  createColumn,
  editColumn,
  deleteColumn,
  getResults
}, dispatch))

export default connect(mapStateToProps(), mapDispatchToProps)(Columns);