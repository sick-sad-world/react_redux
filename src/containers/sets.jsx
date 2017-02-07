// Import utility stuff
// ===========================================================================
import { bindAll, find, filter, includes } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { errorHandler } from '../redux/app';
import { createSet, editSet, deleteSet } from '../redux/sets';

// Import Child components
// ===========================================================================
import ListSection from '../components/list/section';
import ListItem from '../components/list/item';
import EditSet from '../components/edit/set';

class Sourcesets extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, 'createItem', 'deleteItem');
  }

  createItem (value) {
    this.props.createSet({
      name: value
    }).then(({payload}) => {
      this.props.router.push(this.props.route.path+'/'+payload.id);
    }).catch(this.props.errorHandler);
  }

  updateItem (data) {
    return this.props.editSet(data).catch(this.props.errorHandler);
  }

  deleteItem (id) {
    return this.props.deleteSet({id}).catch(this.props.errorHandler);
  }

  render () {
    let listData = {
      payload: this.props.sets,
      state: this.props.state,
      createItem: this.createItem,
      deleteItem: this.deleteItem,
      ...this.props.listProps
    }
    return (
      <div className='mod-page'>
        <ListSection {...listData} >
          <ListItem url={this.props.route.path} current={this.props.curId} deleteText='Delete this set' />
        </ListSection>
        {(this.props.chosen) ? (
          <EditSet data={this.props.chosen} state={this.props.state} sets={this.props.sets} sources={this.props.sources} update={this.updateItem} backPath={this.props.route.path} />
        ) : null}
      </div>
    )
  }
}

Sourcesets.defaultProps = {
  listProps: {
    sortable: false,
    deletable: true,
    texts: {
      title: 'Sources Management',
      description: 'Create, edit and delete sets of sources. Drag to reorder list. Open set to edit the sources in it.',
      btn: 'Create new sourceset',
      placeholder: 'Enter name',
      deleting: 'Are you sure want to delete this Sourceset?',
      empty: 'No sourcesets created yet. Use form above to create one.'
    }
  }
};

// Connect our Container to State
// @ deps -> Sourcesets
// ===========================================================================
const mapStateToProps = ({sets, sources}, ownProps) => {
  let curId = parseInt(ownProps.params.id);
  
  return {
    curId,
    state: sets.state,
    sets: sets.payload.map(({id, name, source_ids}) => ({id, name, source_ids, counter: source_ids.length})),
    sources: sources.payload,
    chosen: find(sets.payload, {id: curId}),
  }
}

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  createSet,
  editSet,
  deleteSet,
  errorHandler
}, dispatch))

export default connect(mapStateToProps, mapDispatchToProps)(Sourcesets);