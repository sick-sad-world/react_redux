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
import { createColumn, editColumn, deleteColumn } from '../redux/columns';

// Import Child components
// ===========================================================================
import Icon from '../components/icon';
import ListSection from '../components/listSection';
import ListItem from '../components/listItem';

class Columns extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, 'createItem', 'deleteItem', 'updateVisiblity', 'makeItemIcon');
  }

  createItem (value) {
    this.props.createColumn({
      name: value
    }).then(({payload}) => {
      this.props.router.push(this.props.route.path+'/'+payload.id);
    }).catch(this.props.errorHandler);
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
      payload: this.props.payload.map(({id, name, open, order}) => ({id, name, open, order})),
      state: this.props.state,
      createItem: this.createItem,
      deleteItem: this.deleteItem,
      ...this.props.listProps
    }
    return (
      <div className='mod-page'>
        <ListSection {...listData} >
          <ListItem url={this.props.route.path} customIcon={this.makeItemIcon} deleteText='Delete this column' />
        </ListSection>
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
  let isValId = curId !== curId;
  return {
    ...columns,
    curId: (isValId) ? curId : null,
    chosen: (isValId) ? find(columns.payload, {id: curId}) : null
  }
}

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  createColumn,
  editColumn,
  deleteColumn,
  errorHandler
}, dispatch))

export default connect(mapStateToProps, mapDispatchToProps)(Columns);