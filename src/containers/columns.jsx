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
import { defColumn, createColumn, editColumn, deleteColumn } from '../redux/columns';

// Import Child components
// ===========================================================================
import Icon from '../components/icon';
import ListSection from '../components/list/section';
import ListItem from '../components/list/item';
import EditColumn from '../components/edit/column';

class Columns extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, 'createItem', 'deleteItem', 'updateItem', 'updateVisiblity', 'makeItemIcon');
  }

  createItem (value) {
    this.props.createColumn({
      name: value
    }).then(({payload}) => {
      this.props.router.push(`${this.props.route.path}/${payload.id}`);
    }).catch(this.props.errorHandler);
  }

  updateItem(data) {
    return this.props.updateColumn(data).catch(this.props.errorHandler);
  }

  deleteItem (id) {
    return this.props.deleteColumn({id}).catch(this.props.errorHandler);
  }

  updateVisiblity (data) {
    return this.props.editColumn(data).catch(this.props.errorHandler);
  }

  makeItemIcon (props) {
    let { id, open } = props;
    let visIconData = this.props.visIconData;
    return <a onClick={() => this.updateVisiblity({id, open: (open) ? 0 : 1})} title={visIconData[open].title}><Icon icon={visIconData[open].icon} /></a>;
  }

  render () {
    
    let listData = {
      curId: this.props.curId,
      payload: this.props.payload,
      state: this.props.state,
      createItem: this.createItem,
      deleteItem: this.deleteItem,
      ...this.props.listProps
    }

    return (
      <div className='mod-page'>
        <ListSection {...listData} >
          <ListItem url={this.props.route.path} customIcon={this.makeItemIcon} current={this.props.curId} deleteText='Delete this column' />
        </ListSection>
        {(this.props.chosen) ? (
          <EditColumn data={this.props.chosen} state={this.props.state} update={this.updateItem} backPath={this.props.route.path} />
        ) : null}
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
  visIconData: [{icon: 'eye', title: 'Show this column'}, {icon: 'eye-with-line', title: 'Hide this column'}]
};

// Connect our Container to State
// @ deps -> Columns
// ===========================================================================
const mapStateToProps = ({columns}, ownProps) => {
  let curId = parseInt(ownProps.params.id);
  let chosen = find(columns.payload, {id: curId});
  if (chosen) {
    if (!chosen.display_settings) chosen.display_settings = defColumn.display_settings;
    chosen.data = { ...defColumn.data, ...chosen.data };
  }
  return {
    curId,
    state: columns.state,
    payload: columns.payload.map(({id, name, open}) => ({id, name, open})),
    chosen,
  }
}

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  createColumn,
  editColumn,
  deleteColumn,
  errorHandler
}, dispatch))

export default connect(mapStateToProps, mapDispatchToProps)(Columns);