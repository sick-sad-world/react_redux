// Import utility stuff
// ===========================================================================
import { bindAll, includes } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { stateNum } from 'common/typecheck';
import { defaultInterface } from '../defaults';
import { makeContainerSelector } from '../selectors';

// Import actions
// ===========================================================================
import { bindActionCreators } from 'redux';
import { createSet, editSet, deleteSet, forseUpdateUniq } from '../actions';

// Import Child components
// ===========================================================================
import DeleteConfirmation from 'common/components/delete-confirmation';
import { ListSection, ListItem } from 'common/components/list';
import { FeedCreate } from 'src/feeds';
import EditSet from '../components/edit';

class Sourcesets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: null
    };
    bindAll(this, 'createItem', 'deleteConfirm', 'updateItem', 'deleteReset');
  }

  createItem(value) {
    this.props.createSet({
      name: value
    }).then(({ payload }) => {
      this.props.router.push(`${this.props.route.path}/${payload.id}`);
    });
  }

  updateItem(data) {
    return this.props.editSet(data);
  }

  deleteConfirm(deleting) {
    return () => this.setState({ deleting });
  }

  deleteReset() {
    this.setState({ deleting: null });
  }

  deleteItem(id) {
    return () => this.props.deleteSet({ id }).then(this.props.forseUpdateUniq).then(this.deleteReset);
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
          <ListItem url={this.props.route.path} current={this.props.curId} deleteText='Delete this set' />
        </ListSection>
        {(this.props.chosen && !this.props.params.create) ? (
          <EditSet
            data={this.props.chosen}
            state={this.props.state}
            current={this.props.curId}
            sets={this.props.payload.filter(({ id }) => id !== this.props.curId)}
            update={this.updateItem}
            backPath={this.props.route.path}
          />
        ) : null}
        {(FeedCreate && this.props.chosen && this.props.params.create) ? (
          <FeedCreate
            set={{
              id: this.props.chosen.id,
              name: this.props.chosen.name
            }}
            onCreate={this.updateItem}
            backPath={this.props.route.path}
          />
        ) : null}
        {(this.state.deleting) ? (
          <DeleteConfirmation close={this.deleteReset} accept={this.deleteItem(this.state.deleting.id)} >
            <dl>
              <dt>Trendolizer sourceset</dt>
              <dd>
                <p>{`ID: ${this.state.deleting.id} - ${this.state.deleting.name}. Containing: ${this.state.deleting.source_ids.length} sources`}</p>
              </dd>
            </dl>
          </DeleteConfirmation>
        ) : null}
      </div>
    );
  }
}

// Sourcesets container default props
// ===========================================================================
Sourcesets.defaultProps = {
  listProps: {
    sortable: false,
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

// Prop type check
// ===========================================================================
Sourcesets.propTypes = {
  curId: PropTypes.number,
  state: stateNum.isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired,
  chosen: PropTypes.object,
  listProps: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  route: PropTypes.shape({
    path: PropTypes.string.isRequired
  }).isRequired,
  params: PropTypes.object.isRequired,
  createSet: PropTypes.func.isRequired,
  editSet: PropTypes.func.isRequired,
  deleteSet: PropTypes.func.isRequired,
  forseUpdateUniq: PropTypes.func.isRequired
};

// Connect our Container to State
// @ deps -> Sourcesets
// ===========================================================================
function mapStateToProps() {
  const selector = makeContainerSelector();
  return (state, props) => selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createSet,
    editSet,
    deleteSet,
    forseUpdateUniq
  }, dispatch);
}

export default connect(mapStateToProps(), mapDispatchToProps)(Sourcesets);
