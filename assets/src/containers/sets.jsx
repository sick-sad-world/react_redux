// Import utility stuff
// ===========================================================================
import { bindAll, find, concat, includes } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { notification } from '../redux/notifications';
import { createSet, editSet, deleteSet, updateUniq } from '../redux/sets';
import { createSource, deleteSource } from '../redux/sources';

// Import Child components
// ===========================================================================
import DeleteConfirmation from '../components/delete-confirm';
import ListSection from '../components/list/section';
import ListItem from '../components/list/item';
import EditSet from '../components/edit/set';
import FeedCreate from '../components/feed-create';

class Sourcesets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: null
    }
    bindAll(this, 'createItem', 'deleteConfirm', 'updateItem', 'createFeed', 'deleteReset');
  }

  createItem (value) {
    this.props.createSet({
      name: value
    }).then(({payload}) => {
      this.props.router.push(`${this.props.route.path}/${payload.id}`);
    });
  }

  updateItem (data) {
    return this.props.editSet(data);
  }

  deleteConfirm (deleting) {
    return () => this.setState({deleting});
  }

  deleteReset () {
    this.setState({deleting: null})
  }

  deleteItem (type, id) {
    return () => {
      if (type) {
        this.props.deleteSource({
          set_id: this.props.curId,
          id: id
        }).then(this.deleteReset);
      } else {
        this.props.deleteSet({id}).then(this.props.updateUniq).then(this.deleteReset);
      }
    }
  }

  createFeed (feeds) {
    Promise.all(feeds.map((feed) => this.props.createSource(feed).then(({payload}) => payload.id)))
      .then((new_ids) => this.updateItem({
        id: this.props.curId,
        source_ids: concat(this.props.chosen.source_ids, new_ids)
      }))
      .then(this.props.updateUniq)
      .then(() => this.props.router.goBack());
  }

  setConfirmation (deleting) {
    let sources = [];
    this.props.sources.forEach(({id, name}) => {
      if (sources.length < 6 && includes(deleting.source_ids, id)) {
        if (sources.length < 5) {
          sources.push(`ID: ${id} - ${name}`);
        } else {
          sources.push('And more...');
        }
      }
    })
    return (
      <dl>
        <dt>Trendolizer sourceset</dt>
        <dd>
          <p>{`ID: ${deleting.id} - ${deleting.name}. Containing: ${deleting.source_ids.length} sources`}</p>
          <ul>
            {sources.map((source, i) => <li key={i}>{source}</li>)}
          </ul>
        </dd>
      </dl>
    )
  }

  feedConfirmation (deleting) {
    return (
      <dl>
        <dt>Trendolizer feed</dt>
        <dd>
          {`ID: ${deleting.id} `}
          <em className='badge' data-type={deleting.type}>{deleting.type}</em>
          <div className='t-ellipsis'>{` ${deleting.feedurl}`}</div>
        </dd>
      </dl>
    )
  }

  render () {
    let Edit = null;
    let listData = {
      payload: this.props.sets,
      state: this.props.state,
      createItem: this.createItem,
      deleteItem: this.deleteConfirm,
      ...this.props.listProps
    }

    if (this.props.curId && this.props.chosen) {
      if (this.props.params.create) {
        Edit = (
          <FeedCreate
            id={this.props.chosen.id}
            name={this.props.chosen.name}
            action={this.createFeed}
            notification={this.props.notification}
          />
        );
      } else {
        Edit = (
          <EditSet
            data={this.props.chosen}
            state={this.props.state}
            current={this.props.curId}
            sets={this.props.sets}
            sources={this.props.sources}
            update={this.updateItem}
            deleteItem={this.deleteConfirm}
            backPath={this.props.route.path}
          />
        );
      }
    }
    return (
      <div className='mod-page'>
        <ListSection {...listData} >
          <ListItem url={this.props.route.path} current={this.props.curId} deleteText='Delete this set' />
        </ListSection>
        {Edit}
        {(this.state.deleting) ? (
          <DeleteConfirmation close={this.deleteReset} accept={this.deleteItem(!!this.state.deleting.feedurl, this.state.deleting.id)} >
          {(this.state.deleting.feedurl) ? this.feedConfirmation(this.state.deleting) : this.setConfirmation(this.state.deleting)}
          </DeleteConfirmation>
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
  createSource,
  editSet,
  deleteSet,
  updateUniq,
  notification,
  deleteSource
}, dispatch))

export default connect(mapStateToProps, mapDispatchToProps)(Sourcesets);