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
import { createSet, deleteSet } from '../redux/sets';

// Import Child components
// ===========================================================================
import ListSection from '../components/listSection';
import ListItem from '../components/listItem';

class Sourcesets extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, ['createItem', 'deleteItem']);
  }

  createItem (value) {
    this.props.createSet({
      name: value
    }).then(({payload}) => {
      this.props.router.push(this.props.route.path+'/'+payload.id);
    }).catch(this.props.errorHandler);
  }

  deleteItem (id) {
    return this.props.deleteSet({id}).catch(this.props.errorHandler);
  }

  render () {
    let listData = {
      payload: this.props.payload.map(({id, name, source_ids}) => ({id, name, counter: source_ids.length})),
      state: this.props.state,
      createItem: this.createItem,
      deleteItem: this.deleteItem,
      ...this.props.listProps
    }
    return (
      <div className='mod-page'>
        <ListSection {...listData} >
          <ListItem url={this.props.route.path} deleteText='Delete this set' />
        </ListSection>
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
      deleting: 'Are you sure want to delete this Sourceset?',
      empty: 'No sourcesets created yet. Use form above to create one.'
    }
  }
};

// Connect our Container to State
// @ deps -> Sourcesets
// ===========================================================================
const mapStateToProps = ({sets}, ownProps) => {
  let curId = parseInt(ownProps.params.id);
  let isValId = curId !== curId;
  return {
    ...sets,
    curId: (isValId) ? curId : null,
    chosen: (isValId) ? find(sets.payload, {id: curId}) : null
  }
}

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  createSet,
  deleteSet,
  errorHandler
}, dispatch))

export default connect(mapStateToProps, mapDispatchToProps)(Sourcesets);